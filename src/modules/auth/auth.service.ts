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
import { ActiveAccountTemplate } from '../core/mail/templates/ActiveAccountTemplate';
import { ResetPasswordTemplate } from '../core/mail/templates/ResetPasswordTemplate';
import { MailBasicDto } from '../core/mail/dto/mail-basic.dto';
import { MailService } from '../core/mail/mail.service';

@Injectable()
export class AuthService {
  private userRepo: Repository<User> = null;

  constructor(
    private readonly connection: Connection,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
  ) {
    this.userRepo = this.connection.getRepository(User);
  }

  async sendMailActive(userRes: IUserResponse) {
    const tokenActive = await this.createToken(
      userRes,
      // 10 min
      `${10 * 60}s`
    );
    const activeLink = `${process.env.APP_FRONT_END}/active-account/${tokenActive}`;
    const html = ActiveAccountTemplate.newInstance().getTemplate({
      activeLink,
    });
    const mailDto = new MailBasicDto({
      to: userRes.email,
      subject: `[${process.env.APP_NAME}] Active your account`,
      html,
    });
    this.mailService.sendMail(mailDto);
  }

  async sendMailRecover(userRes: IUserResponse) {
    const tokenRecover = await this.createToken(
      userRes,
      // 10 min
      `${10 * 60}s`
    );
    const activeLink = `${process.env.APP_FRONT_END}/recover-account-pass/${tokenRecover}`;
    const html = ResetPasswordTemplate.newInstance().getTemplate({
      activeLink,
    });
    const mailDto = new MailBasicDto({
      to: userRes.email,
      subject: `[${process.env.APP_NAME}] Recover your account`,
      html,
    });
    this.mailService.sendMail(mailDto);
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

  async verifyToken(token: string) {
    let task: TaskRes = null;
    try {
      const result = await this.jwtService.verifyAsync(token, { secret: PublicModules.TOKEN_SECRETKEY });
      task = PublicModules.fun_makeResFoundSucc(result);
    } catch (e) {
      task = PublicModules.fun_makeResError(e, 'Invalid link, please use another link');
    }

    return task;
  }

  seedDefaultAdmin(userName: string, email: string, password: string) {
    // this.userRepo.delete({userName: userName});
    this.userRepo.findOne({ where: { userName: userName } })
      .then((find) => {
        // ignore ?
        if (find) return;
        find = this.userRepo.create();
        find.displayName = 'Display name default';
        find.userName = userName;
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
    this.userRepo.findOne({ where: { userName: userName } })
      .then((find) => {
        // ignore ?
        if (find) return;
        find = this.userRepo.create();
        find.displayName = 'Display name default';
        find.userName = userName;
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
    this.userRepo.findOne({ where: { userName: userName } })
      .then((find) => {
        // ignore ?
        if (find) return;
        find = this.userRepo.create();
        find.displayName = 'Display name default';
        find.userName = userName;
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
      task = PublicModules.fun_makeResError(null, 'Invalid userName Or password')
      return task;
    }
    const userRes = PublicModules.fun_secureUserResponse(find);
    // user active ?
    if (!find.isActive) {
      task = PublicModules.fun_makeResError(null, 'User is not active | Please check your email inbox to active account');
      this.sendMailActive(userRes);
      return task;
    }
    // pass correct ?
    const isPass = bcrypt.compareSync(dto.password, find.password);
    if (!isPass) {
      task = PublicModules.fun_makeResError(null, 'Invalid userName Or password');
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
      user: userRes,
    });
    task = PublicModules.fun_makeResCreateSucc(result);

    return task;
  }

  async me(req: any) {
    let task: TaskRes = null;
    const userRes = PublicModules.fun_secureUserResponse(req.user);
    task = PublicModules.fun_makeResFoundSucc(userRes);

    return task;
  }
}
