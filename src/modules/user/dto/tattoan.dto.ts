import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class TatToanDto {
  @ApiProperty()
  @IsNotEmpty()
  tatToanId: number;

  @ApiProperty()
  @IsNotEmpty()
  totalDay: number;
}