import {
  Body,
  Controller,
  Delete,
  FileTypeValidator,
  Get,
  MaxFileSizeValidator,
  Param,
  ParseFilePipe,
  Patch,
  Put,
  UploadedFile,
  UseGuards,
  UseInterceptors,
  ValidationPipe,
} from "@nestjs/common";
import { AppUserService } from "./app-users.service";
import { FileInterceptor } from "@nestjs/platform-express";
import { AuthGuard } from "@nestjs/passport";
import { User } from "src/auth/decorators/user.decorator";
import { AuthenticatedUser } from "src/auth/jwt.strategy";
import { ConnectionInterceptor } from "src/connection/connection.interceptor";
import { AppUserDto } from "./dto/app-users.dto";
//
@UseInterceptors(ConnectionInterceptor)
@Controller("app-user")
@UseGuards(AuthGuard("jwt"))
export class AppUserController {
  constructor(private readonly appUserService: AppUserService) {}

  @Get()
  findAll() {
    return this.appUserService.findAll();
  }

  @Get("current/user")
  findCurrentUser(@User() user: AuthenticatedUser) {
    return this.appUserService.findOne(user.id);
  }

  @Get("role/:roleCode")
  findUsersByRole(@Param("roleCode") roleCode: string) {
    return this.appUserService.findUsersByRole(roleCode);
  }

  @Get(":uuid")
  findOne(@Param("uuid") uuid: string) {
    return this.appUserService.findOne(uuid);
  }

  @Delete(":uuid")
  remove(@Param("uuid") uuid: string, @User() user: AuthenticatedUser) {
    return this.appUserService.disable(uuid, user.id);
  }

  @Patch(":uuid")
  enable(@Param("uuid") uuid: string, @User() user: AuthenticatedUser) {
    return this.appUserService.enable(uuid, user.id);
  }
}
