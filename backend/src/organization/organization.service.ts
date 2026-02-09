import { Injectable } from '@nestjs/common';
import { CreateOrganizationDto } from './dto/create-organization.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Organization } from './entities/organization.entity';
import { Repository } from 'typeorm';
import { ConfigService } from '@nestjs/config';
import { exec } from 'child_process';
import { promisify } from 'util';
import * as path from 'path';
import { AuthenticatedUser } from 'src/auth/jwt.strategy';
import { KeycloakUserService } from 'src/keycloak-user/keycloak-user.service';
import { AccountService } from 'src/account/account.service';

const execAsync = promisify(exec);

@Injectable()
export class OrganizationService {
  constructor(
    @InjectRepository(Organization)
    private readonly organizationRepository: Repository<Organization>,
    private readonly accountService: AccountService,
    private readonly configService: ConfigService,
    private readonly keycloakUserService: KeycloakUserService
  ) {}

  async create(createOrganizationDto: CreateOrganizationDto) {
    let organization = new Organization();
    organization.id = createOrganizationDto.id;
    organization.name = createOrganizationDto.name;
    organization.assets_folder = createOrganizationDto.assets_folder;
    organization.theme = createOrganizationDto.theme;

    organization = await this.organizationRepository.save(organization);

    const schemaName = `org_${organization.id}`;

    await this.organizationRepository.manager.query(`CREATE SCHEMA IF NOT EXISTS "${schemaName}"`);
    try {
      const environment = this.configService.get('ENVIRONMENT');
      const dbHost = environment === 'local' ? 'localhost' : process.env.DB_HOST;
      const dbPort = environment === 'local' ? '5432' : process.env.DB_PORT;
      const dbName = process.env.DB_NAME;
      const dbUser = process.env.DB_USER;
      const dbPass = process.env.DB_PASSWORD;
      const migrationsPath = path.resolve(__dirname, '../../migrations');

      const flywayCommand =
        `flyway -url=jdbc:postgresql://${dbHost}:${dbPort}/${dbName}` +
        ` -user=${dbUser}` +
        ` -password=${dbPass}` +
        ` -schemas=${schemaName}` +
        ` -locations=filesystem:${migrationsPath}` +
        ` migrate`;

      const { stdout, stderr } = await execAsync(flywayCommand);
      console.log('Flyway stdout:', stdout);
      if (stderr) {
        console.error('Flyway stderr:', stderr);
      }
    } catch (err) {
      console.error(err);
      throw new Error('Flyway migration failed.');
    }

    return organization;
  }

  async signup(dto: { name: string; assets_folder: string; theme: any }, user: AuthenticatedUser) {
    const orgId = await this.keycloakUserService.signupOrg(dto.name);
    await this.create({ ...dto, id: orgId });
    const schemaName = `org_${orgId}`;
    const userObject = {
      uuid: user.id,
      first_name: user.first_name,
      last_name: user.last_name,
      email: user.email,
      user_name: user.username,
    };
    await this.accountService.create({
      first_name: userObject.first_name,
      last_name: userObject.last_name,
      email_address: userObject.email,
      company_name: dto.name,
      phone_number: '',
      active: true,
      account_plan_type_code: 'free',
      payment_customer_id: '',
    });
    await this.organizationRepository.manager.query(
      `INSERT INTO "${schemaName}".app_users (uuid, first_name, last_name, email, user_name, role, who_created) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
      [
        userObject.uuid,
        userObject.first_name,
        userObject.last_name,
        userObject.email,
        userObject.user_name,
        'admin',
        user.username,
      ]
    );
    await this.keycloakUserService.signupUser(user, orgId);
  }

  findAll() {
    return this.organizationRepository.find();
  }

  async findOne(id: string) {
    return this.organizationRepository.findOne({ where: { id } });
  }
}
