import { Injectable } from '@nestjs/common';
import { TaskRes } from 'src/common/Classess';
import { PublicModules } from 'src/common/PublicModules';
import { User } from 'src/entities/user.entity';
import { Connection, IsNull, Repository } from 'typeorm';
import { AuthService } from '../auth/auth.service';
import { CreateUserDto } from './dto/create-user.dto';
import { RecoverAccountPasswordDto } from './dto/recover-pass.dto';
import { ChoVayDto } from './dto/chovay.dto';
import { TatToanDto } from './dto/tattoan.dto';
import { RolerUser } from 'src/common/Enums';
import { ChoVayQuery } from './dto/chovay-query.dto';

@Injectable()
export class UserService {
  private userRepo: Repository<User> = null;

  constructor(
    private readonly connection: Connection,
    private readonly authService: AuthService,
  ) {
    this.userRepo = this.connection.getRepository(User);
  }

  async create(dto: CreateUserDto) {
    let task: TaskRes = null;

    // basic check email
    if (!dto.email.includes('@')) {
      task = PublicModules.fun_makeResError(null, 'Invalid email address');
      return task;
    }

    // basic check password
    if (dto.password.length < 3) {
      task = PublicModules.fun_makeResError(null, 'Password length > 3');
      return task;
    }

    // find email
    let find = await this.userRepo.findOne({ where: { email: dto.email } });
    let newUser: User = null;
    if (find) {
      if (find.isActive) {
        task = PublicModules.fun_makeResError(null, `User's Email Found!`);
        return task;
      }
      if (!find.isActive) newUser = find;
      else newUser = this.userRepo.create();
    }

    // add new user;
    newUser.email = dto.email;
    newUser.password = dto.password;
    newUser.displayName = dto.displayName;
    newUser.userName = dto.displayName;
    find = await this.userRepo.save(newUser);
    const userRes = PublicModules.fun_secureUserResponse(find);

    // send email link active.
    task = await this.authService.sendMailActive(find);
    if (!task.success) return task;

    task = PublicModules.fun_makeResCreateSucc(userRes);

    return task;
  }

  async gets() {
    let task: TaskRes = null;
    task = PublicModules.fun_makeResListSucc(await this.userRepo.find({
      where: {
        role: RolerUser.MEM,
      }
    }));

    return task;
  }

  async activeAccount(tokenActive: string) {
    let task: TaskRes = null;
    task = await this.authService.verifyToken(tokenActive);
    if (!task.success) return task;
    const userId = task.result.id;
    const userFind = await this.userRepo.findOne({ where: { id: userId } });
    if (!userFind) {
      task = PublicModules.fun_makeResError(null, 'User not found!');
      return task;
    }
    userFind.isActive = true;
    await this.userRepo.save(userFind);

    return task;
  }

  async recoverAccount(email: string) {
    let task: TaskRes = null;

    if (!email || !email.includes('@')) {
      task = PublicModules.fun_makeResError(null, 'Invalid Email Address');
      return task;
    }

    // find email
    const find = await this.userRepo.findOne({ where: { email } });
    if (!find) {
      task = PublicModules.fun_makeResError(null, 'Email not exists, please register');
      return task;
    }
    const userRes = PublicModules.fun_secureUserResponse(find);
    if (!find.isActive) {
      task = PublicModules.fun_makeResError(null, 'User is not active');
      return task;
    }

    // send mail
    task = await this.authService.sendMailRecover(find);
    if (!task.success) return task;
    task = PublicModules.fun_makeResCreateSucc(userRes);

    return task;
  }

  async recoverAccountPassword(dto: RecoverAccountPasswordDto) {
    let task: TaskRes = null;
    // check token recover
    task = await this.authService.verifyToken(dto.tokenRecover);
    if (!task.success) return task;

    // basic dto check new pass
    if (!dto.newPassword || dto.newPassword.length < 3) {
      task = PublicModules.fun_makeResError(null, 'Password length > 3');
      return task;
    }
    // find user;
    let find = await this.userRepo.findOne({ where: { id: task.result.id } });
    find.password = dto.newPassword;
    await find.hashPassword();
    find = await this.userRepo.save(find);

    return task;
  }
}
