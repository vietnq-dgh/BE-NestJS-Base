import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { AuthService } from 'src/auth/auth.service';
import { CreateUserDto } from 'src/user/dto/createUser.dto';

@Injectable()
export class OauthService {
    constructor(
        private readonly authService: AuthService,
    ){}
    async googleLogin(req){
        const result = await req.user
        if(!result){
          return 'No user from google'
        }
        const data = plainToClass(CreateUserDto,{
            firstName: result.firstName,
            lastName: result.lastName,
            email: result.email,
            password: result.accessToken
        })
        return await this.authService.register(data)
        
        // return{
        //   message: 'User info from Google',
        //   user: result
        // }
    }
    
    facebookLogin(req){
        if(!req.user){
          return 'No user from Facebook'
        }
        return{
          message: 'User info from Facebook',
          user: req.user
        }
    }
}
