import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from 'src/common/entities/User.entity';
import { CreateUserDto } from 'src/auth/dto/createUser.dto';
import { LoginUserDto } from 'src/auth/dto/loginUserDto.dto';
import { UserDto } from 'src/auth/dto/userDto.dto';
import { Connection } from 'typeorm';
import { LoginStatus } from './interfaces/login-status.interface';
import { JwtPayload } from './interfaces/payload.interface';
import { RegistrationStatus } from './interfaces/regisration-status.interface';
import * as Dics from '../common/MyDictionary.json';
import { RolerUser } from 'src/common/Enums';
import * as bcrypt from 'bcrypt';

const libs = require('../common/PublicModules');

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly conn: Connection,
  ) { }

  userRepo = this.conn.getRepository(User);

  async register(userDto: CreateUserDto) {
    var task = null;

    const { displayName, username, email, password, } = userDto;

    // check if the user exists in the db    
    const userInDb = await this.userRepo.findOne({
      where: { username: username }
    });

    const emailInDb = await this.userRepo.findOne({
      where: { email: email }
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

  async login(loginUserDto: LoginUserDto): Promise<LoginStatus> {
    const { username, password } = loginUserDto;

    // find user in db
    const user = await this.userRepo.findOne({ where: { username } });
    if (!user) {
      throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
    }


    //compare passwords
    const areEqual = await bcrypt.compare(password, user.password);
    if (!areEqual) {
      throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
    }

    // generate and sign token
    const token = this._createToken(user);

    const res = {
      email: user.email,
      ...token,
    };
    const task = libs.fun_makeResCreateSucc(res);
    return task;
  }

  async validateUser(payload: JwtPayload): Promise<UserDto> {
    const { username } = payload;
    const user = await this.userRepo.findOne({
      where: { username }
    });
    if (!user) {
      throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
    }
    return user;
  }

}
