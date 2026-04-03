import {
  IsBoolean,
  IsInt,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  Max,
  Min,
} from "class-validator";

export class StaffProfileDto {
  id: string;

  @IsNotEmpty()
  @IsUUID()
  user_uuid: string;

  @IsOptional()
  @IsUUID()
  position_id?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(10)
  priority?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  max_hours_per_week?: number;

  @IsOptional()
  @IsInt()
  @Min(1)
  max_consecutive_days?: number;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  who_created?: string;
  when_created?: Date;
  who_updated?: string;
  when_updated?: Date;
}
