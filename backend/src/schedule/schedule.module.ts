import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Schedule } from "./entities/schedule.entity";
import { ScheduleShift } from "./entities/schedule-shift.entity";
import { StaffingRequirement } from "./entities/staffing-requirement.entity";
import { ScheduleController } from "./schedule.controller";
import { ScheduleService } from "./schedule.service";

@Module({
  imports: [
    TypeOrmModule.forFeature([Schedule, ScheduleShift, StaffingRequirement]),
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService],
  exports: [ScheduleService],
})
export class ScheduleModule {}
