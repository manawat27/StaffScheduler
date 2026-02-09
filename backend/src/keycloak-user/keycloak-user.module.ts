import { forwardRef, Module } from '@nestjs/common';
import { KeycloakUserService } from './keycloak-user.service';
import { KeycloakUserController } from './keycloak-user.controller';
import { KeycloakConfig } from './keycloak.config';
import { AppUserModule } from 'src/app-users/app-users.module';
import { KeycloakStartupService } from './keycloak-startup.service';

@Module({
  imports: [forwardRef(()=> AppUserModule)],
  controllers: [KeycloakUserController],
  providers: [KeycloakUserService, KeycloakConfig, KeycloakStartupService],
  exports: [KeycloakStartupService, KeycloakUserService],
})
export class KeycloakUserModule {}
