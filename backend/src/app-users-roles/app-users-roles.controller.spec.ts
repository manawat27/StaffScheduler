import { Test, TestingModule } from '@nestjs/testing';
import { AppUsersRolesController } from './app-users-roles.controller';
import { AppUsersRolesService } from './app-users-roles.service';

describe('AppUsersRolesController', () => {
  let controller: AppUsersRolesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AppUsersRolesController],
      providers: [AppUsersRolesService],
    }).compile();

    controller = module.get<AppUsersRolesController>(AppUsersRolesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
