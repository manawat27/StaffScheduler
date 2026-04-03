import { PickType } from "@nestjs/swagger";
import { ShiftTypeDto } from "./shift-type.dto";

export class UpdateShiftTypeDto extends PickType(ShiftTypeDto, [
  "name",
  "start_time",
  "end_time",
  "is_active",
  "who_updated",
]) {}
