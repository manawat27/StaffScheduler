import { SetMetadata } from "@nestjs/common";

export enum AppRole {
  ADMIN = "admin",
  MANAGER = "manager",
  STAFF = "staff",
}

export const ROLES_KEY = "roles";

export const Roles = (...roles: AppRole[]) => SetMetadata(ROLES_KEY, roles);
