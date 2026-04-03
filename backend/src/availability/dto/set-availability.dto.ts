import { Type } from "class-transformer";
import {
  IsArray,
  IsBoolean,
  IsInt,
  Max,
  Min,
  ValidateNested,
} from "class-validator";

export class AvailabilityEntryDto {
  @IsInt()
  @Min(0)
  @Max(6)
  day_of_week: number;

  @IsBoolean()
  is_available: boolean;
}

export class SetAvailabilityDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => AvailabilityEntryDto)
  entries: AvailabilityEntryDto[];
}
