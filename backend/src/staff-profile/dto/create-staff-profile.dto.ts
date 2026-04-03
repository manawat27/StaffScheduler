import { PickType } from "@nestjs/swagger";
import { StaffProfileDto } from "./staff-profile.dto";

export class CreateStaffProfileDto extends PickType(StaffProfileDto, [
  "user_uuid",
  "position_id",
  "priority",
  "max_hours_per_week",
  "max_consecutive_days",
  "is_active",
  "who_created",
]) {}
