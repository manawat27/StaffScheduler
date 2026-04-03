import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { StaffProfile } from "./entities/staff-profile.entity";
import { StaffProfileController } from "./staff-profile.controller";
import { StaffProfileService } from "./staff-profile.service";

@Module({
  imports: [TypeOrmModule.forFeature([StaffProfile])],
  controllers: [StaffProfileController],
  providers: [StaffProfileService],
  exports: [StaffProfileService],
})
export class StaffProfileModule {}
