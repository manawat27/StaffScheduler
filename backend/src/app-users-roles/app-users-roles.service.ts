import { Inject, Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { AppUsersRoles } from './entities/app-users-roles.entity';
import { Request } from 'express';
import { REQUEST } from '@nestjs/core';

@Injectable()
export class AppUsersRolesService {
  constructor(@Inject(REQUEST) private readonly request: Request) {}

  private get appUsersRolesRepository(): Repository<AppUsersRoles> {
    const connection = this.request.dbConnection as DataSource;
    if (!connection) {
      throw new Error('Database connection not set on request');
    }
    return connection.getRepository(AppUsersRoles);
  }

  findAll() {
    return this.appUsersRolesRepository.find();
  }

  async findByCode(code: string): Promise<AppUsersRoles> {
    return await this.appUsersRolesRepository.findOne({
      where: {
        code,
      },
    });
  }
}
