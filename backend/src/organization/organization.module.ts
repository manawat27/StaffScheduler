import { Module } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { OrganizationController } from './organization.controller';
import { Organization } from './entities/organization.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { KeycloakUserModule } from 'src/keycloak-user/keycloak-user.module';
import { AccountModule } from 'src/account/account.module';

@Module({
  imports: [KeycloakUserModule, AccountModule, TypeOrmModule.forFeature([Organization])],
  controllers: [OrganizationController],
  providers: [OrganizationService],
  exports: [OrganizationService],
})
export class OrganizationModule {}
