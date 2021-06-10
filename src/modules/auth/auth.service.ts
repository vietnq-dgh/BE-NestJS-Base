import { Injectable } from '@nestjs/common';
import { User } from 'src/entities/user.entity';
import { Connection, Repository } from 'typeorm';
import { JwtPayload } from './dto/JwtPayload';
import * as Dics from 'src/common/MyDictionary.json';
import { PublicModules } from 'src/common/PublicModules';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  private userRepo: Repository<User> = null;

  constructor(
    private readonly connection: Connection,
    private readonly jwtService: JwtService,
  ) {
    this.userRepo = this.connection.getRepository(User);
  }

  async validateUser(payload: JwtPayload): Promise<any> {
    const { address } = payload;
    const user = await this.userRepo.findOne({
      where: { address: address }
    });
    if (!user) {
      const task = PublicModules.fun_makeResError(payload, Dics.UNAUTHORIZED);
      return task;
    }
    return user;
  }

  async createToken(dataSign: any, exp: any = PublicModules.TOKEN_EXPIRESIN) {
    const payLoad = { ...dataSign };
    const token = await this.jwtService.signAsync(payLoad, { expiresIn: exp });
    return token;
  }
}
