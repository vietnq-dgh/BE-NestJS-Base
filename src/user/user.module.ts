import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandModule } from 'nestjs-command';
import { NiceName } from '../common/entities/NiceName.entity';
import { User } from '../common/entities/User.entity';
import { UserSeed } from './seeds/user.seed';
import { UserService } from './user.service';

@Module({
    imports:
    [TypeOrmModule.forFeature([User, NiceName]), CommandModule],
    controllers: [],
    providers: [UserService, UserSeed],
    exports: [UserService, UserSeed],
})
export class UserModule {}
