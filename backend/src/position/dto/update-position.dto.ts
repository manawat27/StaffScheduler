import { PickType } from "@nestjs/swagger";
import { PositionDto } from "./position.dto";

export class UpdatePositionDto extends PickType(PositionDto, [
  "name",
  "description",
  "is_active",
  "who_updated",
]) {}
