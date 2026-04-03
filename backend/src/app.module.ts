import "dotenv/config";
import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { AppService } from "./app.service";
import { AppController } from "./app.controller";
import { MetricsController } from "./metrics.controller";
import { TerminusModule } from "@nestjs/terminus";
import { ScheduleModule as NestScheduleModule } from "@nestjs/schedule";
import { TypeOrmModule } from "@nestjs/typeorm";
import { KeycloakStartupService } from "./keycloak-user/keycloak-startup.service";
import ormconfig from "src/ormconfig";
import { AppUsersRolesModule } from "./app-users-roles/app-users-roles.module";
import { AppUserModule } from "./app-users/app-users.module";
import { KeycloakUserModule } from "./keycloak-user/keycloak-user.module";
import { ConnectionModule } from "./connection/connection.module";
import { AccountModule } from "./account/account.module";
import { OrganizationModule } from "./organization/organization.module";
import { AccountPlanTypeModule } from "./account-plan-type/account-plan-type.module";
import { AuthModule } from "./auth/auth.module";
import { ShiftTypeModule } from "./shift-type/shift-type.module";
import { PositionModule } from "./position/position.module";
import { StaffProfileModule } from "./staff-profile/staff-profile.module";
import { AvailabilityModule } from "./availability/availability.module";
import { TimeOffModule } from "./time-off/time-off.module";
import { ScheduleModule as ShiftScheduleModule } from "./schedule/schedule.module";
import { ShiftPoolModule } from "./shift-pool/shift-pool.module";

@Module({
  imports: [
    TypeOrmModule.forRoot(ormconfig),
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    NestScheduleModule.forRoot(),
    TerminusModule,
    AppUserModule,
    AppUsersRolesModule,
    AuthModule,
    OrganizationModule,
    ConnectionModule,
    KeycloakUserModule,
    AccountModule,
    AccountPlanTypeModule,
    ShiftTypeModule,
    PositionModule,
    StaffProfileModule,
    AvailabilityModule,
    TimeOffModule,
    ShiftScheduleModule,
    ShiftPoolModule,
  ],
  controllers: [AppController, MetricsController],
  providers: [AppService],
})
export class AppModule {
  constructor(
    private readonly keycloakStartupServive: KeycloakStartupService,
  ) {}
}
