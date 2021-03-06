import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsEmail, IsString, IsEnum, IsBoolean } from 'class-validator';
import { rolerUser } from 'src/common/constant';

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

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  confirmPassword: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @ApiProperty({
    description: "Quyền ADMIN hoặc CLIENT",
    default: "CLIENT"
  })
  @IsEnum(rolerUser)
  @IsNotEmpty()
  role: rolerUser;

  @ApiProperty()
  @IsBoolean()
  @IsNotEmpty()
  isActive: boolean;
}