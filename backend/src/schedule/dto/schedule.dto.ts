import {
  IsDateString,
  IsIn,
  IsNotEmpty,
  IsOptional,
  IsString,
} from "class-validator";

export class CreateScheduleDto {
  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsDateString()
  start_date: string;

  @IsNotEmpty()
  @IsDateString()
  end_date: string;

  who_created?: string;
}

export class AddShiftDto {
  @IsNotEmpty()
  @IsString()
  shift_type_id: string;

  @IsNotEmpty()
  @IsString()
  position_id: string;

  @IsNotEmpty()
  @IsDateString()
  date: string;

  @IsOptional()
  @IsString()
  staff_profile_id?: string;

  who_created?: string;
}

export class AssignShiftDto {
  @IsOptional()
  @IsString()
  staff_profile_id?: string;

  who_updated?: string;
}

export class CreateStaffingRequirementDto {
  @IsNotEmpty()
  @IsString()
  shift_type_id: string;

  @IsNotEmpty()
  @IsString()
  position_id: string;

  @IsNotEmpty()
  required_count: number;

  who_created?: string;
}

export class UpdateStaffingRequirementDto {
  @IsNotEmpty()
  required_count: number;

  who_updated?: string;
}
