import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UserDto {
    @IsNotEmpty() 
    id: string;

    @IsString()
    @IsNotEmpty()
    displayName: string;

    @IsString()
    @IsNotEmpty()
    username: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;
}