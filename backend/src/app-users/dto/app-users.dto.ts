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
  role: AppUsersRoles;
  avatar?: Buffer;
  who_created?: string;
  when_created: Date;
  who_updated?: string;
  when_updated: Date;
  enabled: boolean;
}
