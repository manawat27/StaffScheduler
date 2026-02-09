import { PickType } from '@nestjs/swagger';
import { KeycloakUserDto } from './keycloak-user.dto';

export class CreateKeycloakUserDto extends PickType(KeycloakUserDto, [
  'email',
  'user_name',
  'first_name',
  'last_name',
]) {}
