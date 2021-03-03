import { Body, Controller, Get, HttpException, HttpStatus, Post, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiCreatedResponse, ApiForbiddenResponse, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { LoginUserDto } from 'src/user/dto/loginUserDto.dto';
import { AuthService } from './auth.service';
import { LoginStatus } from './interfaces/login-status.interface';
import { JwtPayload } from './interfaces/payload.interface';
import { RegistrationStatus } from './interfaces/regisration-status.interface';

@ApiTags('USER')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService){}

    @Post('register')
    // @ApiCreatedResponse({description: "The payment history has been successfully took."})
    // @ApiForbiddenResponse({description: "Forbidden"})
    public async register(@Body() createUser: CreateUserDto): Promise<RegistrationStatus> {
        const result: RegistrationStatus = await this.authService.register(
            createUser
        );
        if (!result.success) {
            throw new HttpException(result.message, HttpStatus.BAD_REQUEST);
        }
      
        return result;
    }

    @Post('login')
    public async login(@Body() loginUserDto: LoginUserDto): Promise<LoginStatus> {
        return await this.authService.login(loginUserDto);
    }

    @Get('whoami')
    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    public async testAuth(@Req() req: any): Promise<JwtPayload> {
        return req.user;
    }
}
