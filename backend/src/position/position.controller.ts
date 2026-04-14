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
import { PositionService } from "./position.service";
import { CreatePositionDto } from "./dto/create-position.dto";
import { UpdatePositionDto } from "./dto/update-position.dto";

@UseInterceptors(ConnectionInterceptor)
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Controller("positions")
export class PositionController {
  constructor(private readonly positionService: PositionService) {}

  @Get()
  findAll() {
    return this.positionService.findAll();
  }

  @Get("active")
  findActive() {
    return this.positionService.findActive();
  }

  @Get(":id")
  findOne(@Param("id") id: string) {
    return this.positionService.findOne(id);
  }

  @Post()
  @Roles(...MANAGEMENT_ROLES)
  create(@Body() dto: CreatePositionDto, @User() user: AuthenticatedUser) {
    dto.who_created = user.username;
    return this.positionService.create(dto);
  }

  @Put(":id")
  @Roles(...MANAGEMENT_ROLES)
  update(
    @Param("id") id: string,
    @Body() dto: UpdatePositionDto,
    @User() user: AuthenticatedUser,
  ) {
    dto.who_updated = user.username;
    return this.positionService.update(id, dto);
  }
}
