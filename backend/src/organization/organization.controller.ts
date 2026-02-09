import { Controller, Get, UseGuards } from '@nestjs/common';
import { OrganizationService } from './organization.service';
import { User } from 'src/auth/decorators/user.decorator';
import { AuthenticatedUser } from 'src/auth/jwt.strategy';
import { JwtGuard } from 'src/auth/jwt.guard';

@UseGuards(JwtGuard)
@Controller('organization')
export class OrganizationController {
  constructor(private readonly organizationService: OrganizationService) {}

  @Get('/current/user')
  findCurrentOrg(@User() user: AuthenticatedUser) {
    return this.organizationService.findOne(user.organizationId);
  }
}
