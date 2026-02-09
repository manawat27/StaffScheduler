import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppUsersRoles } from './entities/app-users-roles.entity';
import { AppUsersRolesController } from './app-users-roles.controller';
import { AppUsersRolesService } from './app-users-roles.service';

@Module({
  imports: [TypeOrmModule.forFeature([AppUsersRoles])],
  controllers: [AppUsersRolesController],
  providers: [AppUsersRolesService],
  exports: [AppUsersRolesModule],
})
export class AppUsersRolesModule {}
