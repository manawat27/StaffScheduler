import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/auth/roles.guard";
import { Roles, MANAGEMENT_ROLES } from "src/auth/decorators/roles.decorator";
import { User } from "src/auth/decorators/user.decorator";
import { AuthenticatedUser } from "src/auth/jwt.strategy";
import { ConnectionInterceptor } from "src/connection/connection.interceptor";
import { ScheduleService } from "./schedule.service";
import {
  CreateScheduleDto,
  AddShiftDto,
  AssignShiftDto,
  CreateStaffingRequirementDto,
  UpdateStaffingRequirementDto,
} from "./dto/schedule.dto";

@UseInterceptors(ConnectionInterceptor)
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Controller("schedules")
export class ScheduleController {
  constructor(private readonly scheduleService: ScheduleService) {}

  // ─── Schedule CRUD ──────────────────────────────────────

  @Get()
  @Roles(...MANAGEMENT_ROLES)
  findAll() {
    return this.scheduleService.findAllSchedules();
  }

  @Get("published")
  findPublished() {
    return this.scheduleService.findPublishedSchedules();
  }

  @Get("staff/me")
  getMyShifts(@User() user: AuthenticatedUser) {
    return this.scheduleService.getShiftsForStaffInCurrentSchedule(user.id);
  }

  @Get("staff/:staffProfileId")
  @Roles(...MANAGEMENT_ROLES)
  getStaffShifts(@Param("staffProfileId") staffProfileId: string) {
    return this.scheduleService.getShiftsForStaff(staffProfileId);
  }

  @Get("config/staffing-requirements")
  @Roles(...MANAGEMENT_ROLES)
  findAllRequirements() {
    return this.scheduleService.findAllRequirements();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.scheduleService.findScheduleById(id);
  }

  @Post()
  @Roles(...MANAGEMENT_ROLES)
  create(@Body() dto: CreateScheduleDto, @User() user: AuthenticatedUser) {
    dto.who_created = user.username;
    return this.scheduleService.createSchedule(dto);
  }

  @Put(":id/publish")
  @Roles(...MANAGEMENT_ROLES)
  publish(@Param("id") id: string, @User() user: AuthenticatedUser) {
    return this.scheduleService.publishSchedule(id, user.username);
  }

  @Put(":id/archive")
  @Roles(...MANAGEMENT_ROLES)
  archive(@Param("id") id: string, @User() user: AuthenticatedUser) {
    return this.scheduleService.archiveSchedule(id, user.username);
  }

  // ─── Shift Management ──────────────────────────────────

  @Post(":id/shifts")
  @Roles(...MANAGEMENT_ROLES)
  addShift(
    @Param("id") scheduleId: string,
    @Body() dto: AddShiftDto,
    @User() user: AuthenticatedUser,
  ) {
    dto.who_created = user.username;
    return this.scheduleService.addShift(scheduleId, dto);
  }

  @Put("shifts/:shiftId/assign")
  @Roles(...MANAGEMENT_ROLES)
  assignShift(
    @Param("shiftId") shiftId: string,
    @Body() dto: AssignShiftDto,
    @User() user: AuthenticatedUser,
  ) {
    dto.who_updated = user.username;
    return this.scheduleService.assignShift(shiftId, dto);
  }

  // ─── Auto-Generate ─────────────────────────────────────

  @Post(":id/auto-generate")
  @Roles(...MANAGEMENT_ROLES)
  autoGenerate(@Param("id") id: string, @User() user: AuthenticatedUser) {
    return this.scheduleService.autoGenerate(id, user.username);
  }

  // ─── Staffing Requirements ─────────────────────────────

  @Post("config/staffing-requirements")
  @Roles(...MANAGEMENT_ROLES)
  createRequirement(
    @Body() dto: CreateStaffingRequirementDto,
    @User() user: AuthenticatedUser,
  ) {
    dto.who_created = user.username;
    return this.scheduleService.createRequirement(dto);
  }

  @Put("config/staffing-requirements/:id")
  @Roles(...MANAGEMENT_ROLES)
  updateRequirement(
    @Param("id") id: string,
    @Body() dto: UpdateStaffingRequirementDto,
    @User() user: AuthenticatedUser,
  ) {
    dto.who_updated = user.username;
    return this.scheduleService.updateRequirement(id, dto);
  }

  @Delete("config/staffing-requirements/:id")
  @Roles(...MANAGEMENT_ROLES)
  deleteRequirement(@Param("id") id: string) {
    return this.scheduleService.deleteRequirement(id);
  }
}
