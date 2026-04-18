import {
  Body,
  Controller,
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
import { ShiftPoolService } from "./shift-pool.service";
import {
  CreateShiftPoolRequestDto,
  ReviewShiftPoolRequestDto,
} from "./dto/shift-pool.dto";
import { StaffProfile } from "../staff-profile/entities/staff-profile.entity";
import { DataSource } from "typeorm";
import { Inject } from "@nestjs/common";
import { REQUEST } from "@nestjs/core";
import { Request } from "express";

@UseInterceptors(ConnectionInterceptor)
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Controller("shift-pool")
export class ShiftPoolController {
  constructor(
    private readonly shiftPoolService: ShiftPoolService,
    @Inject(REQUEST) private readonly request: Request,
  ) {}

  @Get()
  async findOpenShifts(@User() user: AuthenticatedUser) {
    // Get the staff's position to filter open shifts
    const connection = this.request.dbConnection as DataSource;
    const profile = await connection
      .getRepository(StaffProfile)
      .findOne({ where: { user_uuid: user.id } });
    return this.shiftPoolService.findOpenShifts(profile?.position_id);
  }

  @Get("my-requests")
  async findMyRequests(@User() user: AuthenticatedUser) {
    const connection = this.request.dbConnection as DataSource;
    const profile = await connection
      .getRepository(StaffProfile)
      .findOne({ where: { user_uuid: user.id } });
    if (!profile) return [];
    return this.shiftPoolService.findRequestsByStaff(profile.id);
  }

  @Post(":shiftId/request")
  async createRequest(
    @Param("shiftId") shiftId: string,
    @User() user: AuthenticatedUser,
  ) {
    const connection = this.request.dbConnection as DataSource;
    const profile = await connection
      .getRepository(StaffProfile)
      .findOne({ where: { user_uuid: user.id } });
    if (!profile) {
      throw new Error("Staff profile not found");
    }
    const dto: CreateShiftPoolRequestDto = {
      schedule_shift_id: shiftId,
      staff_profile_id: profile.id,
      who_created: user.username,
    };
    return this.shiftPoolService.createRequest(dto);
  }

  @Get(":shiftId/requests")
  @Roles(...MANAGEMENT_ROLES)
  findRequestsForShift(@Param("shiftId") shiftId: string) {
    return this.shiftPoolService.findRequestsForShift(shiftId);
  }

  @Put("requests/:requestId/review")
  @Roles(...MANAGEMENT_ROLES)
  reviewRequest(
    @Param("requestId") requestId: string,
    @Body() dto: ReviewShiftPoolRequestDto,
    @User() user: AuthenticatedUser,
  ) {
    return this.shiftPoolService.reviewRequest(
      requestId,
      dto,
      user.id,
      user.username,
    );
  }
}
