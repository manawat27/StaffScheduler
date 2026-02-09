import { forwardRef, Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { AppUsers } from "./entities/app-users.entity";
import { AppUserController } from "./app-users.controller";
import { AppUserService } from "./app-users.service";
import { KeycloakUserModule } from "src/keycloak-user/keycloak-user.module";

@Module({
  imports: [
    TypeOrmModule.forFeature([AppUsers]),
    forwardRef(() => KeycloakUserModule),
  ],
  controllers: [AppUserController],
  providers: [AppUserService],
  exports: [AppUserService],
})
export class AppUserModule {}
