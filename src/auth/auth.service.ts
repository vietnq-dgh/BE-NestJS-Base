import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/user/dto/createUser.dto';
import { LoginUserDto } from 'src/user/dto/loginUserDto.dto';
import { UserDto } from 'src/user/dto/userDto.dto';
import { UserService } from 'src/user/user.service';
import { LoginStatus } from './interfaces/login-status.interface';
import { JwtPayload } from './interfaces/payload.interface';
import { RegistrationStatus } from './interfaces/regisration-status.interface';

@Injectable()
export class AuthService {
    constructor(
        private readonly userService: UserService,
        private readonly jwtService: JwtService,
    ){}

    async register(userDto: CreateUserDto): Promise<RegistrationStatus> {
        let status: RegistrationStatus = {
          success: true,
          message: 'user registered',
        };
    
        try {
          if(userDto.password == userDto.confirmPassword)
          await this.userService.create(userDto);
        } catch (err) {
          status = {
            success: false,
            message: err,
          };
        }
    
        return status;
      }

      private _createToken({ username }: UserDto): any {
        const expiresIn = process.env.EXPIRESIN;
    
        const user: JwtPayload = { username };
        const accessToken = this.jwtService.sign(user);
        return {
          expiresIn,
          accessToken,
        };
      }

      async login(loginUserDto: LoginUserDto): Promise<LoginStatus> {
        // find user in db
        const user = await this.userService.findByLogin(loginUserDto);
    
        // generate and sign token
        const token = this._createToken(user);
    
        return {
          email: user.email,
          ...token,
        };
      }

      async validateUser(payload: JwtPayload): Promise<UserDto> {
        const user = await this.userService.findByPayload(payload);
        if (!user) {
          throw new HttpException('Invalid token', HttpStatus.UNAUTHORIZED);
        }
        return user;
      }

}
