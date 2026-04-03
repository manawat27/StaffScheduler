import { forwardRef, Inject, Injectable, Logger } from "@nestjs/common";
import { DataSource, In, Repository } from "typeorm";
import { AppUsers } from "./entities/app-users.entity";
import { CreateAppUserDto } from "./dto/create-app-users.dto";
import { entityRelations } from "../util/constants";
import sharp from "sharp";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";
import { UpdateAppUserDto } from "./dto/update-app-users.dto";
import { AppUserDto } from "./dto/app-users.dto";
import { AuthenticatedUser } from "src/auth/jwt.strategy";
import { KeycloakUserService } from "src/keycloak-user/keycloak-user.service";
import { UpdateKeycloakUserDto } from "src/keycloak-user/dto/update-keycloak-user.dto";
import { AppUsersRoles } from "src/app-users-roles/entities/app-users-roles.entity";

const relations = entityRelations.AppUser;

interface Params {
  limit: number;
  page: number;
  sortBy: string;
  sortOrder: "asc" | "desc";
  filters: {
    buildingId: string;
    tenantId: string;
    isOutstandingInsurance: string;
  };
}

@Injectable()
export class AppUserService {
  private readonly logger = new Logger(AppUserService.name);
  constructor(
    @Inject(REQUEST) private readonly request: Request,
    @Inject(forwardRef(() => KeycloakUserService))
    private readonly keycloakUserService: KeycloakUserService,
  ) {}

  private get appUserRepository(): Repository<AppUsers> {
    const connection = this.request.dbConnection as DataSource;
    if (!connection) {
      throw new Error("Database connection not set on request");
    }
    return connection.getRepository(AppUsers);
  }

  async create(createAppUserDto: CreateAppUserDto) {
    const createAppUser = this.appUserRepository.create(createAppUserDto);
    return this.appUserRepository.save(createAppUser);
  }

  async update(uuid: string, updateAppUserDto: UpdateAppUserDto) {
    await this.appUserRepository.update(uuid, updateAppUserDto);
    return this.appUserRepository.findOne({ where: { uuid } });
  }

  async delete(uuid: string): Promise<void> {
    await this.appUserRepository.delete(uuid); // may want to make this a soft delete in the future
  }

  async disable(uuid: string, userId: string): Promise<void> {
    //await this.appUserRepository.delete(uuid); // may want to make this a soft delete in the future
    await this.appUserRepository.update(uuid, {
      enabled: false,
      who_updated: userId,
    });
  }

  async enable(uuid: string, userId: string): Promise<void> {
    await this.appUserRepository.update(uuid, {
      enabled: true,
      who_updated: userId,
    });
  }

  findAll() {
    return this.appUserRepository.find({
      order: { user_name: "ASC", when_created: "DESC" },
    });
  }

  findUsersByRole(roleCode: string) {
    return this.appUserRepository.find({
      where: { role: { code: roleCode }, enabled: true },
      relations: ["role"],
    });
  }

  async findOne(uuid: string) {
    return this.appUserRepository.findOne({ where: { uuid }, relations });
  }

  findByUuids(uuids: string[]) {
    return this.appUserRepository.find({
      where: { uuid: In(uuids) },
      relations,
    });
  }

  findByUsername(username: string) {
    return this.appUserRepository.findOne({ where: { user_name: username } });
  }
}
