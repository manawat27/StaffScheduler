import { PickType } from "@nestjs/swagger";
import { PositionDto } from "./position.dto";

export class CreatePositionDto extends PickType(PositionDto, [
  "name",
  "description",
  "is_active",
  "who_created",
]) {}
