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
import { Roles, AppRole } from "src/auth/decorators/roles.decorator";
import { User } from "src/auth/decorators/user.decorator";
import { AuthenticatedUser } from "src/auth/jwt.strategy";
import { ConnectionInterceptor } from "src/connection/connection.interceptor";
import { TimeOffService } from "./time-off.service";
import { CreateTimeOffDto } from "./dto/create-time-off.dto";
import { ReviewTimeOffDto } from "./dto/review-time-off.dto";

@UseInterceptors(ConnectionInterceptor)
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Controller("time-off")
export class TimeOffController {
  constructor(private readonly timeOffService: TimeOffService) {}

  @Get()
  @Roles(AppRole.MANAGER, AppRole.ADMIN)
  findAll() {
    return this.timeOffService.findAll();
  }

  @Get("staff/:staffProfileId")
  findByStaffProfile(@Param("staffProfileId") staffProfileId: string) {
    return this.timeOffService.findByStaffProfile(staffProfileId);
  }

  @Post()
  create(@Body() dto: CreateTimeOffDto, @User() user: AuthenticatedUser) {
    dto.who_created = user.username;
    return this.timeOffService.create(dto);
  }

  @Put(":id/review")
  @Roles(AppRole.MANAGER, AppRole.ADMIN)
  review(
    @Param("id") id: string,
    @Body() dto: ReviewTimeOffDto,
    @User() user: AuthenticatedUser,
  ) {
    return this.timeOffService.review(id, dto, user.id, user.username);
  }
}
