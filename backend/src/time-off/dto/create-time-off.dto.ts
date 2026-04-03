import {
  IsDateString,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
} from "class-validator";

export class CreateTimeOffDto {
  @IsNotEmpty()
  @IsUUID()
  staff_profile_id: string;

  @IsNotEmpty()
  @IsDateString()
  start_date: string;

  @IsNotEmpty()
  @IsDateString()
  end_date: string;

  @IsOptional()
  @IsString()
  reason?: string;

  who_created?: string;
}
