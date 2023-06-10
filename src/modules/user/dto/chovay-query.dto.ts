import { ApiPropertyOptional } from "@nestjs/swagger";

export class ChoVayQuery {
  @ApiPropertyOptional({ default: 0 })
  customer: number;
}