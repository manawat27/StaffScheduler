import { Controller, Get } from "@nestjs/common";
import { Public } from "./auth/decorators/public.decorator";

@Controller()
export class AppController {
  constructor() {}

  @Get()
  @Public()
  checkHealth() {
    return {
      status: "ok",
      timestamp: new Date().toISOString(),
    };
  }
}
