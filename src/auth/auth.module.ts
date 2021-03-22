import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { JwtStrategy } from './jwt.strategy';
require("dotenv").config({path: '.env'});

export const SECRETKEY: any = String(process.env.SECRETKEY);
export const EXPIRESIN: any = String(process.env.EXPIRESIN);

@Module({
    imports:[
        PassportModule.register({
            defaultStrategy:'jwt',
            property: 'user',
            session: false,
        }),
        JwtModule.register({
            secret: SECRETKEY,
            signOptions:{
                expiresIn: EXPIRESIN
            },
        }),
    ],
    controllers: [AuthController],
    providers: [AuthService, JwtStrategy],
    exports: [PassportModule, JwtModule, AuthService],
})
export class AuthModule {}
