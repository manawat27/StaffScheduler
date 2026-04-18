import { SetMetadata } from "@nestjs/common";

export enum AppRole {
  ADMIN = "admin",
  GENERAL_MANAGER = "general_manager",
  FOH_MANAGER = "front_of_house_manager",
  HOST = "host",
  SERVER = "server",
  EXPO = "expo",
}

export const MANAGEMENT_ROLES = [
  AppRole.ADMIN,
  AppRole.GENERAL_MANAGER,
  AppRole.FOH_MANAGER,
];

export const ROLES_KEY = "roles";

export const Roles = (...roles: AppRole[]) => SetMetadata(ROLES_KEY, roles);
