import { Controller, Get, UseGuards } from '@nestjs/common';
import { KeycloakGuard } from './middleware/keycloak.guard';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @UseGuards(KeycloakGuard)
  getHello(): string {
    return this.appService.getHello();
  }
}
