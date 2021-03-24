import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { TaskRes } from 'src/common/Classess';
import { AuthService } from './auth.service';
import { JwtPayload } from './interfaces/payload.interface';
require("dotenv").config({path: '.env'});

export const SECRETKEY: any = String(process.env.SECRETKEY);

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) { 
    constructor(private readonly authService: AuthService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            secretOrKey: SECRETKEY,
        });  
    }
    
    async validate(payload: JwtPayload){
        const user = await this.authService.validateUser(payload);
        if (!user) {
            const task = new TaskRes();
            task.bonus = payload;
            task.message = HttpStatus[HttpStatus.UNAUTHORIZED];
            task.statusCode = HttpStatus.UNAUTHORIZED;
            return task;
        }    
        return user;
    }
}