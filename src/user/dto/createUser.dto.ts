import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class CreateUserDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  firstName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  lastName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;
}