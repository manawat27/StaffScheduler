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
import { ShiftTypeService } from "./shift-type.service";
import { CreateShiftTypeDto } from "./dto/create-shift-type.dto";
import { UpdateShiftTypeDto } from "./dto/update-shift-type.dto";

@UseInterceptors(ConnectionInterceptor)
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Controller("shift-types")
export class ShiftTypeController {
  constructor(private readonly shiftTypeService: ShiftTypeService) {}

  @Get()
  findAll() {
    return this.shiftTypeService.findAll();
  }

  @Get("active")
  findActive() {
    return this.shiftTypeService.findActive();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.shiftTypeService.findOne(id);
  }

  @Post()
  @Roles(...MANAGEMENT_ROLES)
  create(@Body() dto: CreateShiftTypeDto, @User() user: AuthenticatedUser) {
    dto.who_created = user.username;
    return this.shiftTypeService.create(dto);
  }

  @Put(":id")
  @Roles(...MANAGEMENT_ROLES)
  update(
    @Param("id") id: string,
    @Body() dto: UpdateShiftTypeDto,
    @User() user: AuthenticatedUser,
  ) {
    dto.who_updated = user.username;
    return this.shiftTypeService.update(id, dto);
  }
}
