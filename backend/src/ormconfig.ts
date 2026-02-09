import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Organization } from "./organization/entities/organization.entity";
import { AppUsers } from "./app-users/entities/app-users.entity";
import { AppUsersRoles } from "./app-users-roles/entities/app-users-roles.entity";
import { Account } from "./account/entities/account.entity";
import { AccountPlanType } from "./account-plan-type/entities/account-plan-type.entity";
const ormconfig: TypeOrmModuleOptions = {
  logging: ["error"],
  type: "postgres",
  host: process.env.POSTGRES_HOST || "localhost",
  port: 5432,
  database: process.env.POSTGRES_DATABASE || "scheduler",
  username: process.env.POSTGRES_USER || "schdusr",
  password: process.env.POSTGRES_PASSWORD || "password",
  entities: [Organization, AppUsers, AppUsersRoles, Account, AccountPlanType],
  synchronize: false,
};
export default ormconfig;
