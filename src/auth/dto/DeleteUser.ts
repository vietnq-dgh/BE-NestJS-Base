import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty } from "class-validator";

export class DeleteUser{
    @ApiProperty()
    @IsNotEmpty()
    userID: string;
}