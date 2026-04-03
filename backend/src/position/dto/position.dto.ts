import { IsBoolean, IsNotEmpty, IsOptional, IsString } from "class-validator";

export class PositionDto {
  id: string;

  @IsNotEmpty()
  @IsString()
  name: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsOptional()
  @IsBoolean()
  is_active?: boolean;

  who_created?: string;
  when_created?: Date;
  who_updated?: string;
  when_updated?: Date;
}
