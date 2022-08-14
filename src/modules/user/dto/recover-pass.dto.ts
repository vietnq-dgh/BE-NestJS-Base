import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class RecoverAccountPasswordDto {
  @ApiProperty()
  @IsNotEmpty()
  tokenRecover: string;

  @ApiProperty()
  @IsNotEmpty()
  newPassword: string;
}