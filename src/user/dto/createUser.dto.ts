import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString, IsEnum, IsBoolean } from 'class-validator';
import { RolerUser } from 'src/common/Enums';

export class CreateUserDto {

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  displayName: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  username: string;

  @ApiProperty()
  @IsNotEmpty()
  password: string;

  // @ApiProperty()
  // @IsString()
  // @IsNotEmpty()
  // confirmPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  // @ApiProperty({
  //   description: "Quyền ADMIN hoặc CLIENT",
  //   default: "CLIENT"
  // })
  // @IsEnum(RolerUser)
  // @IsNotEmpty()
  // role: RolerUser;

  // @ApiProperty()
  // @IsBoolean()
  // @IsNotEmpty()
  // isActive: boolean;
}