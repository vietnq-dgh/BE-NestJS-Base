import { ApiProperty } from "@nestjs/swagger";

export class TaskRes {
  @ApiProperty()
  statusCode: number;
  @ApiProperty()
  message: string;
  @ApiProperty()
  result: any;
  @ApiProperty()
  total: number;
  @ApiProperty()
  error: any;
  @ApiProperty()
  success: boolean;
}