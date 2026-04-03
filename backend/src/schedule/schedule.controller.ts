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
import { Roles, AppRole } from "src/auth/decorators/roles.decorator";
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
  @Roles(AppRole.MANAGER, AppRole.ADMIN)
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
  @Roles(AppRole.MANAGER, AppRole.ADMIN)
  getStaffShifts(@Param("staffProfileId") staffProfileId: string) {
    return this.scheduleService.getShiftsForStaff(staffProfileId);
  }

  @Get("config/staffing-requirements")
  @Roles(AppRole.MANAGER, AppRole.ADMIN)
  findAllRequirements() {
    return this.scheduleService.findAllRequirements();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.scheduleService.findScheduleById(id);
  }

  @Post()
  @Roles(AppRole.MANAGER, AppRole.ADMIN)
  create(@Body() dto: CreateScheduleDto, @User() user: AuthenticatedUser) {
    dto.who_created = user.username;
    return this.scheduleService.createSchedule(dto);
  }

  @Put(":id/publish")
  @Roles(AppRole.MANAGER, AppRole.ADMIN)
  publish(@Param("id") id: string, @User() user: AuthenticatedUser) {
    return this.scheduleService.publishSchedule(id, user.username);
  }

  @Put(":id/archive")
  @Roles(AppRole.MANAGER, AppRole.ADMIN)
  archive(@Param("id") id: string, @User() user: AuthenticatedUser) {
    return this.scheduleService.archiveSchedule(id, user.username);
  }

  // ─── Shift Management ──────────────────────────────────

  @Post(":id/shifts")
  @Roles(AppRole.MANAGER, AppRole.ADMIN)
  addShift(
    @Param("id") scheduleId: string,
    @Body() dto: AddShiftDto,
    @User() user: AuthenticatedUser,
  ) {
    dto.who_created = user.username;
    return this.scheduleService.addShift(scheduleId, dto);
  }

  @Put("shifts/:shiftId/assign")
  @Roles(AppRole.MANAGER, AppRole.ADMIN)
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
  @Roles(AppRole.MANAGER, AppRole.ADMIN)
  autoGenerate(@Param("id") id: string, @User() user: AuthenticatedUser) {
    return this.scheduleService.autoGenerate(id, user.username);
  }

  // ─── Staffing Requirements ─────────────────────────────

  @Post("config/staffing-requirements")
  @Roles(AppRole.MANAGER, AppRole.ADMIN)
  createRequirement(
    @Body() dto: CreateStaffingRequirementDto,
    @User() user: AuthenticatedUser,
  ) {
    dto.who_created = user.username;
    return this.scheduleService.createRequirement(dto);
  }

  @Put("config/staffing-requirements/:id")
  @Roles(AppRole.MANAGER, AppRole.ADMIN)
  updateRequirement(
    @Param("id") id: string,
    @Body() dto: UpdateStaffingRequirementDto,
    @User() user: AuthenticatedUser,
  ) {
    dto.who_updated = user.username;
    return this.scheduleService.updateRequirement(id, dto);
  }

  @Delete("config/staffing-requirements/:id")
  @Roles(AppRole.MANAGER, AppRole.ADMIN)
  deleteRequirement(@Param("id") id: string) {
    return this.scheduleService.deleteRequirement(id);
  }
}
