import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { CreateUserDto } from 'src/auth/dto/createUser.dto';
import { LoginUserDto } from 'src/auth/dto/loginUserDto.dto';
import { User } from 'src/common/entities/User.entity';
import { getRepository } from 'typeorm';
import { AuthService } from './auth.service';
import { LoginStatus } from './interfaces/login-status.interface';
import { LEN_OF_FIELDS } from 'src/common/Enums';
import PublicModules from "../common/PublicModules";

const libs = new PublicModules();

@ApiTags('USER')
@Controller('auth')
export class AuthController {
    constructor(private readonly authService: AuthService,) { }

    userRepo = getRepository(User);

    @Post()
    public async login(@Body() loginUserDto: LoginUserDto): Promise<LoginStatus> {
        return await this.authService.login(loginUserDto);
    }

    @Get('me')
    @UseGuards(AuthGuard())
    @ApiBearerAuth()
    public async testAuth(@Req() req: any) {
        const task = this.authService.me(req);
        return task;
    }

    @Get('user')
    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    async getUsers(@Req() req: any): Promise<any> {
        const isClient = libs.fun_isAuthClient(req);
        if (isClient) {
            return isClient;
        }
        const task = await this.authService.gets();

        return task;
    }

    @Get('user/:id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    async getUser(@Param('id') id: string, @Req() req: any): Promise<any> {
        var task = null;
        const isClient = libs.fun_isAuthClient(req);
        if (isClient) {
            return isClient;
        }

        task = await this.authService.get(id);
        return task;
    }

    @Post('user')
    public async register(@Body() createUser: CreateUserDto): Promise<any> {
        const result = await this.authService.post(createUser);

        return result;
    }

    @Post('create')
    @UseGuards(AuthGuard())
    @ApiBearerAuth()
    async createUser(@Req() req: any, @Body() body: CreateUserDto): Promise<any> {
        const isClient = libs.fun_isAuthClient(req);
        if (isClient) {
            return isClient;
        }

        const task = await this.authService.create(body);

        return task;
    }

    @Delete('user/:id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    async deleteUser(@Req() req: any, @Param('id') id: string): Promise<any> {
        const isClient = libs.fun_isAuthClient(req);
        if (isClient) {
            return isClient;
        }
        const task = await this.authService.delete(id);
        return task;
    }

    @Put('user/:id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    async updateUser(@Body() body: CreateUserDto, @Req() req: any, @Param('id') id: string) {
        var task = null;
        // is id length long ?
        task = libs.fun_isLengthToLong(id, LEN_OF_FIELDS.LENGTH_LOW);
        if (task) {
            return task;
        }

        task = await this.authService.put(req, id, body);
        return task;
    }
}
