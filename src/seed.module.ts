import { HttpException, Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { APP_FILTER } from '@nestjs/core';
import { TypeOrmModule, TypeOrmModuleAsyncOptions } from '@nestjs/typeorm';
import { CommandModule } from 'nestjs-command';
import { AuthModule } from './auth/auth.module';
import { UserEntity } from './user/entity/user.entity';
import { UserModule } from './user/user.module';
@Module({
    imports: [
        UserModule, AuthModule, CommandModule,
        TypeOrmModule.forRootAsync({
            imports: [ConfigModule],
            useFactory: async (configService: ConfigService) => ({
              type: configService.get('DB_SERVER_TYPE', 'postgres'),
              host: configService.get<string>('DB_SERVER_HOST', 'localhost'),
              port: configService.get<number>('DB_SERVER_PORT', 5432),
              username: configService.get('DB_SERVER_USERNAME', 'postgres'),
              password: configService.get('DB_SERVER_PASSWORD', '123456789'),
              database: configService.get('DB_SERVER_NAME', 'user-demo'),
              entities: [
                UserEntity,
                ],
              synchronize: true,
            }),
            inject: [ConfigService],
        } as TypeOrmModuleAsyncOptions),
    ],
    providers: [
        {
            provide: APP_FILTER,
            useClass: HttpException,
        }
    ],
})
export class SeedModule {}