import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolesGaurd } from '../auth/Guards/roles.gaurd';
import { RolerUser } from 'src/common/Enums';
import { AuthGuard } from '@nestjs/passport';

@Controller('user')
@ApiTags('USER')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @ApiOperation({summary: 'User register role default [ MEM ]'})
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({summary: 'Get list user role [ ADMIN ] '})
  @UseGuards(AuthGuard(), new RolesGaurd(RolerUser.ADMIN))
  async gets(){
    return await this.userService.gets();
  }
}
