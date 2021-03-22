import { ApiProperty } from "@nestjs/swagger";
import { IsBoolean, IsNotEmpty, IsString } from "class-validator";

export class CreateDto{
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name : string;
}

export class UpdateDto{
    @ApiProperty()
    @IsNotEmpty()
    @IsString()
    name: string;

    @ApiProperty({default: false})
    @IsNotEmpty()
    @IsBoolean()
    isDelete: boolean;
}