import { Test, TestingModule } from '@nestjs/testing';
import { AppUsersRolesService } from './app-users-roles.service';

describe('AppUsersRolesService', () => {
  let service: AppUsersRolesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AppUsersRolesService],
    }).compile();

    service = module.get<AppUsersRolesService>(AppUsersRolesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
