import { Controller, Get, UseInterceptors } from '@nestjs/common';
import { AppUsersRolesService } from './app-users-roles.service';
import { ConnectionInterceptor } from 'src/connection/connection.interceptor';

@UseInterceptors(ConnectionInterceptor)
@Controller('app-user-role')
export class AppUsersRolesController {
  constructor(private readonly appUsersRolesService: AppUsersRolesService) {}

  @Get()
  findAll() {
    return this.appUsersRolesService.findAll();
  }
}
