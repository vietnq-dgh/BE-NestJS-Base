import { Injectable, UnauthorizedException } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { Connection, Repository } from 'typeorm';
import { JwtPayload } from './dto/JwtPayload';
import * as Dics from 'src/common/MyDictionary.json';
import { PublicModules } from 'src/common/PublicModules';
import { JwtService } from '@nestjs/jwt';
import { RolerUser } from 'src/common/Enums';
import { LoginDto } from './dto/login.dto';
import { TaskRes } from 'src/common/Classess';
import * as bcrypt from "bcrypt";
import { plainToClass } from 'class-transformer';

@Injectable()
export class AuthService {
  private userRepo: Repository<User> = null;

  constructor(
    private readonly connection: Connection,
    private readonly jwtService: JwtService,
  ) {
    this.userRepo = this.connection.getRepository(User);
  }

  async validateUser(payload: JwtPayload): Promise<User> {
    const { email, password } = payload;
    const user = await this.userRepo.findOne({ where: { email: email } });
    if (!user) throw new UnauthorizedException();
    // pass correct ?
    const isPass = password === user.password;
    if (!isPass) throw new UnauthorizedException();

    const _user = plainToClass(User, { ...user, password: '' });
    return _user;
  }

  async createToken(dataSign: any, exp: any = PublicModules.TOKEN_EXPIRESIN) {
    const payLoad = { ...dataSign };
    const token = await this.jwtService.signAsync(payLoad, { expiresIn: exp });
    return token;
  }

  seedDefaultAdmin(userName: string, email: string, password: string) {
    // this.userRepo.delete({username: userName});
    this.userRepo.findOne({ where: { username: userName } })
      .then((find) => {
        // ignore ?
        if (find) return;
        find = this.userRepo.create();
        find.displayName = 'Display name default';
        find.username = userName;
        find.password = password;
        find.email = email;
        find.role = RolerUser.ADMIN;
        find.isActive = true;
        find.niceName = 'Nice name default';
        //save
        this.userRepo.save(find);
      });
  }


  seedDefaultMod(userName: string, email: string, password: string) {
    this.userRepo.findOne({ where: { username: userName } })
      .then((find) => {
        // ignore ?
        if (find) return;
        find = this.userRepo.create();
        find.displayName = 'Display name default';
        find.username = userName;
        find.password = password;
        find.email = email;
        find.role = RolerUser.MOD;
        find.isActive = true;
        find.niceName = 'Nice name default';
        //save
        this.userRepo.save(find);
      });
  }

  seedDefaultMem(userName: string, email: string, password: string) {
    this.userRepo.findOne({ where: { username: userName } })
      .then((find) => {
        // ignore ?
        if (find) return;
        find = this.userRepo.create();
        find.displayName = 'Display name default';
        find.username = userName;
        find.password = password;
        find.email = email;
        find.role = RolerUser.MEM;
        find.isActive = true;
        find.niceName = 'Nice name default';
        //save
        this.userRepo.save(find);
      });
  }

  async login(dto: LoginDto) {
    let task: TaskRes = null;
    const find = await this.userRepo.findOne({ where: { email: dto.email } });
    // exists ?
    if (!find) {
      task = PublicModules.fun_makeResNotFound(null, 'EMAIL');
      return task;
    }
    // user active ?
    if (!find.isActive) {
      task = PublicModules.fun_makeResError(null, 'User is not active');
      return task;
    }
    // pass correct ?
    const isPass = bcrypt.compareSync(dto.password, find.password);
    if (!isPass) {
      task = PublicModules.fun_makeResError(null, Dics.PASSWORD_NON_VALID);
      return task;
    }

    // ok
    const token = await this.createToken(find);
    const refresh = await this.createToken(find, PublicModules.TOKEN_REFRESH_EXPIRESIN);
    const result = Object.assign({}, {
      gaurd: {
        token: token,
        refresh: refresh,
      },
    });
    task = PublicModules.fun_makeResCreateSucc(result);

    return task;
  }

  async me(req: any) {
    let task: TaskRes = null;
    task = PublicModules.fun_makeResFoundSucc(req.user);

    return task;
  }
}
