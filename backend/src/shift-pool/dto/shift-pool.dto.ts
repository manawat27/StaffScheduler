import { IsIn, IsNotEmpty, IsString } from "class-validator";

export class CreateShiftPoolRequestDto {
  @IsNotEmpty()
  @IsString()
  schedule_shift_id: string;

  staff_profile_id?: string;
  who_created?: string;
}

export class ReviewShiftPoolRequestDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(["approved", "denied"])
  status: string;
}
