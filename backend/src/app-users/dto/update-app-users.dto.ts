import { PickType } from "@nestjs/swagger";
import { AppUserDto } from "./app-users.dto";

export class UpdateAppUserDto extends PickType(AppUserDto, [
  "email",
  "user_name",
  "first_name",
  "last_name",
  "phone",
  "date_of_birth",
  "country",
  "city",
  "postal_code",
  "role",
  "enabled",
  "avatar",
  "who_updated",
]) {}
