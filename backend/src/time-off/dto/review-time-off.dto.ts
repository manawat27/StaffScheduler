import { IsIn, IsNotEmpty, IsString } from "class-validator";

export class ReviewTimeOffDto {
  @IsNotEmpty()
  @IsString()
  @IsIn(["approved", "denied"])
  status: string;
}
