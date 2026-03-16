import { IsEmail } from "class-validator";
import { AppUsersRoles } from "src/app-users-roles/entities/app-users-roles.entity";

export class AppUserDto {
  uuid: string;
  @IsEmail({}, { message: "Please enter the valid email." })
  email: string;
  user_name: string;
  first_name: string;
  last_name: string;
  phone?: string;
  date_of_birth?: Date;
  country?: string;
  city?: string;
  postal_code?: string;
  role: AppUsersRoles;
  enabled: boolean;
  avatar?: Buffer;
  who_created?: string;
  when_created: Date;
  who_updated?: string;
  when_updated: Date;
}
