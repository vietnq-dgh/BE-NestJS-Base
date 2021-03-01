import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommandModule } from 'nestjs-command';
import { UserEntity } from './entity/user.entity';
import { UserSeed } from './seeds/user.seed';
import { UserService } from './user.service';

@Module({
    imports:
    [TypeOrmModule.forFeature([UserEntity]), CommandModule],
    controllers: [],
    providers: [UserService, UserSeed],
    exports: [UserService, UserSeed],
})
export class UserModule {}
