import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class ShiftTypeDto {
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsNotEmpty()
  @IsString()
  start_time: string;

  @IsNotEmpty()
  @IsString()
  end_time: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  who_created?: string;
  when_created?: Date;
  who_updated?: string;
  when_updated?: Date;
}
