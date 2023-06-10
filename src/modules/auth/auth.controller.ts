import { Controller, Get, Post, Body, Req, UseGuards, Res, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { LoginDto } from './dto/login.dto';
import { AuthGuard } from '@nestjs/passport';
import { Request, Response } from 'express';
import { PublicModules } from 'src/common/PublicModules';

@Controller('auth')
@ApiTags('AUTH')
export class AuthController {
  constructor(private readonly authService: AuthService) {
    // seed default admin
    const env = process.env.ENV;
    const isDev = env.toLowerCase() === 'dev';
    if (isDev) {
      this.authService.seedDefaultAdmin('admin', 'admin@gmail.com', 'adminVSL@03112000');
    }
  }

  @Post()
  @ApiOperation({ summary: 'Login to authen' })
  async login(@Body() dto: LoginDto, @Res({ passthrough: true }) res: Response) {
    const result = await this.authService.login(dto);
    // set cookie for client?
    if (result.success) {
      res.cookie('jwt', result.result.gaurd.token, {
        expires: PublicModules.fun_getTokenExpired_NumberMilis().expiredInDate,
        httpOnly: true,
        secure: process.env.ENV.toLowerCase() === 'prod',
      });
    }
    return result;
  }

  @Delete()
  @ApiOperation({ summary: 'Logout' })
  logout(@Res({ passthrough: true }) res: Response) {
    res.clearCookie('jwt');
    return PublicModules.fun_makeResDeleteSucc('jwt');
  }

  @Get()
  @UseGuards(AuthGuard())
  @ApiOperation({ summary: 'Get user profile' })
  async me(@Req() req: Request) {
    return await this.authService.me(req);
  }
}
