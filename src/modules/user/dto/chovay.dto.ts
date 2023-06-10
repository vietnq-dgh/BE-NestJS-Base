import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class ChoVayDto {
  @ApiProperty()
  @IsNotEmpty()
  initialAmout: number;

  @ApiProperty()
  @IsNotEmpty()
  feePerDay: number;

  @ApiProperty()
  @IsNotEmpty()
  userId: number;

  @ApiProperty()
  @IsNotEmpty()
  startDay: number;
}