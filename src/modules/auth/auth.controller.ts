import { Controller, Get, Post, Body, Put, Param, Delete, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
@ApiTags('AUTH')
export class AuthController {
  constructor(private readonly authService: AuthService) {
    // seed default admin
    this.authService.seedDefaultAdmin('admin', 'admin@gmail.com', 'admin@123');
  }

  @Post()
  @ApiOperation({summary: 'Login to authen'})
  async login(@Body() dto: LoginDto){
    return await this.authService.login(dto);
  }

  @Get()
  @UseGuards(AuthGuard())
  @ApiBearerAuth()
  @ApiOperation({summary: 'Get user profile'})
  async me(@Req() req: any){
    return await this.authService.me(req);
  }
}
