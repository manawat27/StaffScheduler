import { PickType } from '@nestjs/swagger';
import { AppUsersRolesDto } from './app-users-roles.dto';

export class UpdateAppUsersRolesDto extends PickType(AppUsersRolesDto, [
  'code',
  'description',
  'effective_date',
  'expiry_date',
  'who_updated',
] as const) {}
