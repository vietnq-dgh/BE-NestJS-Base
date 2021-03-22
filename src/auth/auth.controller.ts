import { Body, Controller, Delete, Get, HttpStatus, Param, Post, Put, Req, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { TaskRes } from 'src/common/TaskRes';
import { CreateUserDto } from 'src/auth/dto/createUser.dto';
import { LoginUserDto } from 'src/auth/dto/loginUserDto.dto';
import { User } from 'src/common/entities/User.entity';
import { getRepository } from 'typeorm';
import { AuthService } from './auth.service';
import { LoginStatus } from './interfaces/login-status.interface';
import { JwtPayload } from './interfaces/payload.interface';
import { RegistrationStatus } from './interfaces/regisration-status.interface';
import * as Dics from '../common/MyDictionary.json';
import { LEN_OF_FIELDS, RolerUser } from 'src/common/Enums';

const libs = require('../common/PublicModules');

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
    public async testAuth(@Req() req: any): Promise<JwtPayload> {
        const res = req.user;
        const task = libs.fun_makeResFoundSucc(res);
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
        const res = await this.userRepo.find();
        const task = libs.fun_makeResListSucc(res, null, null);

        return task;
    }

    @Get('user/:id')
    @ApiBearerAuth()
    @UseGuards(AuthGuard())
    async getUser(@Param('id') id: string, @Req() req: any): Promise<any> {
        var task = null;
        task = libs.fun_isLengthToLong(id, LEN_OF_FIELDS.LENGTH_LOW);
        if (task) {
            return task;
        }

        const isClient = libs.fun_isAuthClient(req);
        if (isClient) {
            return isClient;
        }

        const user = await this.userRepo.findOne({ id: id });
        if (!user) {
            task.statusCode = HttpStatus.NOT_FOUND;
            task.message = HttpStatus[HttpStatus.NOT_FOUND];
            task.bonus = id;
            return task;
        }
        task = libs.fun_makeResFoundSucc(user);
        return task;
    }

    @Post('user')
    public async register(@Body() createUser: CreateUserDto): Promise<RegistrationStatus> {
        const result = await this.authService.register(createUser);

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

        var task = null;
        const {
            username,
            email,
        } = body;

        // is username length long ?
        task = libs.fun_isLengthToLong(username, LEN_OF_FIELDS.LENGTH_LOW);
        if (task) {
            return task;
        }

        // is email length long ?
        task = libs.fun_isLengthToLong(email, LEN_OF_FIELDS.LENGTH_LOW);
        if (task) {
            return task;
        }

        // User Name ?
        let user = await this.userRepo.findOne({ where: { username: username } });
        if (user) {
            task.statusCode = HttpStatus.FOUND;
            task.message = HttpStatus[HttpStatus.FOUND];
            task.bonus = Dics.USERNAME_FOUND;
            return task;
        }

        // Email ?
        user = await this.userRepo.findOne({ where: { email: email } });
        if (user) {
            task.statusCode = HttpStatus.FOUND;
            task.message = HttpStatus[HttpStatus.FOUND];
            task.bonus = Dics.EMAIL_FOUND;
            return task;
        }

        const {
            displayName,
            password,
        } = body;

        // is displayName length long ?
        task = libs.fun_isLengthToLong(displayName, LEN_OF_FIELDS.LENGTH_LOW);
        if (task) {
            return task;
        }

        // is password length long ?
        task = libs.fun_isLengthToLong(password, LEN_OF_FIELDS.LENGTH_LOW);
        if (task) {
            return task;
        }

        // Create new
        const newUser = this.userRepo.create();
        newUser.displayName = displayName;
        newUser.username = username;
        newUser.password = password;
        newUser.email = email;
        newUser.isActive = true;
        newUser.role = RolerUser.ADMIN;

        // Add DB
        const isInsert = await this.userRepo.insert(newUser);
        task.statusCode = HttpStatus.CREATED;
        task.message = HttpStatus[HttpStatus.CREATED];
        task.bonus = isInsert;

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
        var task = null;

        // is id length long ?
        task = libs.fun_isLengthToLong(id, LEN_OF_FIELDS.LENGTH_LOW);
        if (task) {
            return task;
        }

        const user = await this.userRepo.findOne({ where: { id: id } });
        if (!user) {
            task.statusCode = HttpStatus.NOT_FOUND;
            task.message = HttpStatus[HttpStatus.NOT_FOUND]
            return task;
        }
        const delRes = await this.userRepo.delete({ id: id });
        task.statusCode = HttpStatus.OK;
        task.message = HttpStatus[HttpStatus.OK];
        task.bonus = delRes;
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

        const idToken = req.user.id;
        if (idToken != id) {
            task.statusCode = HttpStatus.UNAUTHORIZED;
            task.message = HttpStatus[HttpStatus.UNAUTHORIZED];
            task.bonus = `ID: ${id} # ${idToken}`;
            return task;
        }

        const user = await this.userRepo.findOne({ id: idToken });
        if (!user) {
            task.statusCode = HttpStatus.NOT_FOUND;
            task.message = HttpStatus[HttpStatus.NOT_FOUND];
            task.bonus = id;
            return task;
        }

        const newPass = await libs.fun_hashPassword(body.password);
        body.password = newPass;
        var result = this.userRepo.merge(user, body);
        result = await this.userRepo.save(result);
        task.statusCode = HttpStatus.OK;
        task.message = HttpStatus[HttpStatus.OK];
        task.bonus = result;
        return task;
    }
}
