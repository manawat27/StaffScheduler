import { PickType } from "@nestjs/swagger";
import { ShiftTypeDto } from "./shift-type.dto";

export class CreateShiftTypeDto extends PickType(ShiftTypeDto, [
  "name",
  "start_time",
  "end_time",
  "is_active",
  "who_created",
]) {}
