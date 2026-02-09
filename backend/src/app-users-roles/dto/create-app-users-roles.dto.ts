import { PickType } from '@nestjs/swagger';
import { AppUsersRolesDto } from './app-users-roles.dto';

export class CreateAppUsersRolesDto extends PickType(AppUsersRolesDto, [
  'code',
  'description',
  'effective_date',
  'expiry_date',
  'who_created',
] as const) {}
