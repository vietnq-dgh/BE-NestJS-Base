import { Controller, Get, Post, Body, Param, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RecoverAccountPasswordDto } from './dto/recover-pass.dto';

@Controller('user')
@ApiTags('USER')
export class UserController {
  constructor(private readonly userService: UserService) { }

  @Post()
  @ApiOperation({ summary: 'User register role default [ MEM ]' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get list user' })
  async gets() {
    return await this.userService.gets();
  }

  @Post('/active/:tokenActive')
  @ApiOperation({ summary: 'Active user account' })
  activeAccount(@Param('tokenActive') tokenActive: string) {
    return this.userService.activeAccount(tokenActive);
  }

  @Post('/recover/:email')
  @ApiOperation({ summary: 'Send mail recover user account' })
  recoverAccount(@Param('email') email: string) {
    return this.userService.recoverAccount(email);
  }

  @Put('/recover-password')
  @ApiOperation({ summary: 'Active user account' })
  recoverAccountPassword(@Body() dto: RecoverAccountPasswordDto) {
    return this.userService.recoverAccountPassword(dto);
  }
}
