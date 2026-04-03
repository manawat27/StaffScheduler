import { TypeOrmModuleOptions } from "@nestjs/typeorm";
import { Organization } from "./organization/entities/organization.entity";
import { AppUsers } from "./app-users/entities/app-users.entity";
import { AppUsersRoles } from "./app-users-roles/entities/app-users-roles.entity";
import { Account } from "./account/entities/account.entity";
import { AccountPlanType } from "./account-plan-type/entities/account-plan-type.entity";
import { ShiftType } from "./shift-type/entities/shift-type.entity";
import { Position } from "./position/entities/position.entity";
import { StaffProfile } from "./staff-profile/entities/staff-profile.entity";
import { Availability } from "./availability/entities/availability.entity";
import { TimeOffRequest } from "./time-off/entities/time-off-request.entity";
import { Schedule } from "./schedule/entities/schedule.entity";
import { ScheduleShift } from "./schedule/entities/schedule-shift.entity";
import { StaffingRequirement } from "./schedule/entities/staffing-requirement.entity";
import { ShiftPoolRequest } from "./shift-pool/entities/shift-pool-request.entity";
const ormconfig: TypeOrmModuleOptions = {
  logging: ["error"],
  type: "postgres",
  host: process.env.POSTGRES_HOST || "localhost",
  port: 5432,
  database: process.env.POSTGRES_DATABASE || "scheduler",
  username: process.env.POSTGRES_USER || "schdusr",
  password: process.env.POSTGRES_PASSWORD || "password",
  entities: [
    Organization,
    AppUsers,
    AppUsersRoles,
    Account,
    AccountPlanType,
    ShiftType,
    Position,
    StaffProfile,
    Availability,
    TimeOffRequest,
    Schedule,
    ScheduleShift,
    StaffingRequirement,
    ShiftPoolRequest,
  ],
  synchronize: false,
};
export default ormconfig;
