import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class UserDto {
    @IsNotEmpty() 
    id: string;

    @IsString()
    @IsNotEmpty()
    firstName: string;

    @IsString()
    @IsNotEmpty()
    lastName: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;
}