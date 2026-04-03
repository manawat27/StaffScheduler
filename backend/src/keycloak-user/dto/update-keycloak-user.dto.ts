import { PickType } from "@nestjs/swagger";
import { KeycloakUserDto } from "./keycloak-user.dto";

export class UpdateKeycloakUserDto extends PickType(KeycloakUserDto, [
  "email",
  "user_name",
  "first_name",
  "last_name",
  "enabled",
  "email_verified",
  "phone",
  "date_of_birth",
  "country",
  "city",
  "postal_code",
]) {}
