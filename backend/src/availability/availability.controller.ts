import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  UseGuards,
  UseInterceptors,
} from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";
import { RolesGuard } from "src/auth/roles.guard";
import { User } from "src/auth/decorators/user.decorator";
import { AuthenticatedUser } from "src/auth/jwt.strategy";
import { ConnectionInterceptor } from "src/connection/connection.interceptor";
import { AvailabilityService } from "./availability.service";
import { SetAvailabilityDto } from "./dto/set-availability.dto";

@UseInterceptors(ConnectionInterceptor)
@UseGuards(AuthGuard("jwt"), RolesGuard)
@Controller("availability")
export class AvailabilityController {
  constructor(private readonly availabilityService: AvailabilityService) {}

  @Get(":staffProfileId")
  findByStaffProfile(@Param("staffProfileId") staffProfileId: string) {
    return this.availabilityService.findByStaffProfile(staffProfileId);
  }

  @Put(":staffProfileId")
  setAvailability(
    @Param("staffProfileId") staffProfileId: string,
    @Body() dto: SetAvailabilityDto,
    @User() user: AuthenticatedUser,
  ) {
    return this.availabilityService.setAvailability(
      staffProfileId,
      dto,
      user.username,
    );
  }
}
