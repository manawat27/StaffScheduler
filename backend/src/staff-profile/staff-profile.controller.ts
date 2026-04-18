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
import { StaffProfileService } from "./staff-profile.service";
import { CreateStaffProfileDto } from "./dto/create-staff-profile.dto";
import { UpdateStaffProfileDto } from "./dto/update-staff-profile.dto";

@UseInterceptors(ConnectionInterceptor)
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Controller("staff-profiles")
export class StaffProfileController {
  constructor(private readonly staffProfileService: StaffProfileService) {}

  @Get()
  @Roles(...MANAGEMENT_ROLES)
  findAll() {
    return this.staffProfileService.findAll();
  }

  @Get("me")
  findMyProfile(@User() user: AuthenticatedUser) {
    return this.staffProfileService.findByUserUuid(user.id);
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.staffProfileService.findOne(id);
  }

  @Post()
  @Roles(...MANAGEMENT_ROLES)
  create(@Body() dto: CreateStaffProfileDto, @User() user: AuthenticatedUser) {
    dto.who_created = user.username;
    return this.staffProfileService.create(dto);
  }

  @Put(":id")
  @Roles(...MANAGEMENT_ROLES)
  update(
    @Param("id") id: string,
    @Body() dto: UpdateStaffProfileDto,
    @User() user: AuthenticatedUser,
  ) {
    dto.who_updated = user.username;
    return this.staffProfileService.update(id, dto);
  }
}
