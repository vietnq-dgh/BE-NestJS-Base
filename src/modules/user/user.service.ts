import { Injectable } from '@nestjs/common';
import { TaskRes } from 'src/common/Classess';
import { PublicModules } from 'src/common/PublicModules';
import { User } from 'src/entities/user.entity';
import { Connection, Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import * as Dics from 'src/common/MyDictionary.json';
import { plainToClass } from 'class-transformer';

@Injectable()
export class UserService {
  private userRepo: Repository<User> = null;

  constructor(
    private readonly connection: Connection,
  ) {
    this.userRepo = this.connection.getRepository(User);
  }

  async create(dto: CreateUserDto) {
    let task: TaskRes = null;
    // find email
    let find = await this.userRepo.findOne({ where: { email: dto.email } });
    if (find) {
      task = PublicModules.fun_makeResError(null, Dics.EMAIL_FOUND);
      return task;
    }

    // user name
    find = await this.userRepo.findOne({ where: { username: dto.username } });
    if (find) {
      task = PublicModules.fun_makeResError(null, Dics.USERNAME_FOUND);
      return task;
    }

    // add new
    find = plainToClass(User, dto);
    find = await this.userRepo.save(find);
    task = PublicModules.fun_makeResCreateSucc(find);

    return task;
  }
}
