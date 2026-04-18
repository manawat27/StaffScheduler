import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseInterceptors,
  UseGuards,
  Query,
} from "@nestjs/common";
import { KeycloakUserService } from "./keycloak-user.service";
import { CreateKeycloakUserDto } from "./dto/create-keycloak-user.dto";
import { UpdateKeycloakUserDto } from "./dto/update-keycloak-user.dto";
import { ConnectionInterceptor } from "src/connection/connection.interceptor";
import { AuthGuard } from "@nestjs/passport";
import { User } from "src/auth/decorators/user.decorator";
import { AuthenticatedUser } from "src/auth/jwt.strategy";
import { AppUsersRoles } from "src/app-users-roles/entities/app-users-roles.entity";
import { RolesGuard } from "src/auth/roles.guard";
import { AppRole, Roles } from "src/auth/decorators/roles.decorator";

@UseInterceptors(ConnectionInterceptor)
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Controller("keycloak-user")
export class KeycloakUserController {
  constructor(private readonly keycloakUserService: KeycloakUserService) {}

  @Post()
  @Roles(AppRole.ADMIN)
  create(
    @User() user: AuthenticatedUser,
    @Body()
    createKeycloakUserDto: CreateKeycloakUserDto & {
      role: AppUsersRoles;
      phone: string;
    },
  ) {
    return this.keycloakUserService.create(createKeycloakUserDto, user);
  }

  @Patch(":uuid")
  update(
    @User() user: AuthenticatedUser,
    @Param("uuid") uuid: string,
    @Body()
    updateKeycloakUserDto: UpdateKeycloakUserDto & {
      role: AppUsersRoles;
    },
  ) {
    return this.keycloakUserService.update(
      uuid,
      updateKeycloakUserDto,
      user.id,
    );
  }

  @Delete(":uuid")
  @Roles(AppRole.ADMIN)
  remove(@User() user: AuthenticatedUser, @Param("uuid") uuid: string) {
    return this.keycloakUserService.remove(uuid);
  }
}
