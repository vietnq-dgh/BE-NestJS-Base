import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/common/entities/User.entity';
import { CreateUserDto } from 'src/auth/dto/createUser.dto';
import { LoginUserDto } from 'src/auth/dto/loginUserDto.dto';
import { UserDto } from 'src/auth/dto/userDto.dto';
import { Connection } from 'typeorm';
import { JwtPayload } from './interfaces/payload.interface';
import * as Dics from '../common/MyDictionary.json';
import { LEN_OF_FIELDS, RolerUser } from 'src/common/Enums';
import * as bcrypt from 'bcrypt';
import PublicModules from "../common/PublicModules";

const libs = new PublicModules();

@Injectable()
export class AuthService {
    constructor(
        private readonly jwtService: JwtService,
        private readonly conn: Connection,
    ) { }

    userRepo = this.conn.getRepository(User);

    me(req: any) {
        const res = req.user;
        const task = libs.fun_makeResFoundSucc(res);
        return task;
    }

    async gets() {
        const res = await this.userRepo.find({ where: { isDelete: false } });
        const task = libs.fun_makeResListSucc(res, null, null);
        return task;
    }

    async get(id: string) {
        var task = null;
        task = libs.fun_isLengthToLong(id, LEN_OF_FIELDS.LENGTH_LOW);
        if (task) {
            return task;
        }

        const user = await this.userRepo.findOne({ id: id, isDelete: false });
        if (!user) {
            task = libs.fun_makeResError(id, Dics.NOT_FOUND);
            return task;
        }
        task = libs.fun_makeResFoundSucc(user);
        return task;
    }

    async create(body: CreateUserDto) {
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
        let user = await this.userRepo.findOne({ where: { username: username, isDelete: false } });
        if (user) {
            task = libs.fun_makeResError(username, Dics.USERNAME_FOUND);
            return task;
        }

        // Email ?
        user = await this.userRepo.findOne({ where: { email: email, isDelete: false } });
        if (user) {
            task = libs.fun_makeResError(email, Dics.EMAIL_FOUND);
            return task;
        }

        const {
            displayName,
            password,
        } = body;

        // check valid password
        task = libs.fun_isValidPassword(password);
        if (!task) {
            task = libs.fun_makeResError(`pwd: ${password} | req: ${Dics.PASSWORD_NON_VALID_MESS}`, Dics.PASSWORD_NON_VALID);
            return task;
        }

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
        task = libs.fun_makeResCreateSucc(isInsert);

        return task;
    }

    async delete(id: string) {
        var task = null;
        // is id length long ?
        task = libs.fun_isLengthToLong(id, LEN_OF_FIELDS.LENGTH_LOW);
        if (task) {
            return task;
        }

        const user = await this.userRepo.findOne({ where: { id: id, isDelete: false } });
        if (!user) {
            task = libs.fun_makeResError(id, Dics.NOT_FOUND);
            return task;
        }

        // Delete
        user.isDelete = true;
        task = await this.userRepo.save(user);
        task = libs.fun_makeResDeleteSucc(task);
        return task;
    }

    async put(req: any, id: string, body: CreateUserDto) {
        var task = null;
        const idToken = req.user.id;
        if (idToken != id) {
            task = libs.fun_makeResError(`ID: ${id} # ${idToken}`, Dics.UNAUTHORIZED);
            return task;
        }

        const user = await this.userRepo.findOne({ id: idToken, isDelete: false });
        if (!user) {
            task = libs.fun_makeResError(id, Dics.NOT_FOUND);
            return task;
        }

        const newPass = await libs.fun_hashPassword(body.password);
        body.password = newPass;
        var result = this.userRepo.merge(user, body);
        result = await this.userRepo.save(result);
        task = libs.fun_makeResUpdateSucc(result);
        return task;
    }

    async post(userDto: CreateUserDto) {
        var task = null;

        const { displayName, username, email, password, } = userDto;

        // is displayName length long ?
        task = libs.fun_isLengthToLong(displayName, LEN_OF_FIELDS.LENGTH_LOW);
        if (task) {
            return task;
        }

        // is username length long ?
        task = libs.fun_isLengthToLong(username, LEN_OF_FIELDS.LENGTH_LOW);
        if (task) {
            return task;
        }

        // is username length long ?
        task = libs.fun_isLengthToLong(email, LEN_OF_FIELDS.LENGTH_LOW);
        if (task) {
            return task;
        }

        // is password length long ?
        task = libs.fun_isLengthToLong(password, LEN_OF_FIELDS.LENGTH_LOW);
        if (task) {
            return task;
        }

        // check valid password
        task = libs.fun_isValidPassword(password);
        if (!task) {
            task = libs.fun_makeResError(`pwd: ${password} | req: ${Dics.PASSWORD_NON_VALID_MESS}`, Dics.PASSWORD_NON_VALID);
            return task;
        }

        // check if the user exists in the db    
        const userInDb = await this.userRepo.findOne({
            where: { username: username, isDelete: false }
        });

        const emailInDb = await this.userRepo.findOne({
            where: { email: email, isDelete: false }
        });

        if (userInDb) {
            task = libs.fun_makeResError(username, Dics.USERNAME_FOUND);
            return task;
        }

        if (emailInDb) {
            task = libs.fun_makeResError(email, Dics.EMAIL_FOUND);
            return task;
        }

        const isActive = true;
        const role = RolerUser.CLIENT;
        const user: User = this.userRepo.create({ displayName, username, password, email, isActive, role });
        task = await this.userRepo.save(user);
        task = libs.fun_makeResCreateSucc(task);
        return task;
    }

    private _createToken({ username }: UserDto): any {
        const expiresIn = process.env.EXPIRESIN;

        const user: JwtPayload = { username };
        const accessToken = this.jwtService.sign(user);
        return {
            expiresIn,
            accessToken,
        };
    }

    async login(loginUserDto: LoginUserDto) {
        var task = null;
        const { username, password } = loginUserDto;

        // is username length long ?
        task = libs.fun_isLengthToLong(username, LEN_OF_FIELDS.LENGTH_LOW);
        if (task) {
            return task;
        }

        // is password length long ?
        task = libs.fun_isLengthToLong(password, LEN_OF_FIELDS.LENGTH_LOW);
        if (task) {
            return task;
        }

        // find user in db
        const user = await this.userRepo.findOne({ where: { username: username, isDelete: false } });
        if (!user) {
            task = libs.fun_makeResError(null, Dics.USERNAME_NOT_MATH);
            return task;
        }


        //compare passwords
        const areEqual = await bcrypt.compare(password, user.password);
        if (!areEqual) {
            task = libs.fun_makeResError(null, Dics.PASSWORD_NOT_MATH);
            return task;
        }

        // generate and sign token
        const token = this._createToken(user);

        const res = {
            email: user.email,
            ...token,
        };
        task = libs.fun_makeResCreateSucc(res);
        return task;
    }

    async validateUser(payload: JwtPayload): Promise<any> {
        const { username } = payload;
        const user = await this.userRepo.findOne({
            where: { username, isDelete: false }
        });
        if (!user) {
            const task = libs.fun_makeResError(payload, Dics.UNAUTHORIZED);
            return task;
        }
        return user;
    }

}
