import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginUserDto } from './dto/loginUserDto.dto';
import { UserDto } from './dto/userDto.dto';
import { UserEntity } from './entity/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/createUser.dto';
import { HttpExceptionFilter } from 'src/common/fillters/http-exception.fillter';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>, 
    ){}

    async findOne(user: any){
        return await this.userRepo.findOne(user);
    }

    async findByLogin({ username, password}: LoginUserDto){
        const user = await this.userRepo.findOne({where:{username}});
        if(!user){
            throw new HttpException('User not found', HttpStatus.UNAUTHORIZED);
        }

    
        //compare passwords
        const areEqual = await bcrypt.compare(password, user.password);
        if(!areEqual){
            throw new HttpException('Invalid credentials', HttpStatus.UNAUTHORIZED);
        }

        return user
    }

    async findByPayload({username}:any){
        return await this.findOne({
            where: { username }
        });
    }

    async create(userDto: CreateUserDto){    
        const { displayName, username, email, password, confirmPassword, isActive, role} = userDto;
        
        // check if the user exists in the db    
        const userInDb = await this.userRepo.findOne({ 
            where: { username } 
        });

        const emailInDb = await this.userRepo.findOne({
            where: { email }
        });

        if (userInDb) {
            return { success: false, message: 'User name already exists'};   
        }

        if (emailInDb){
            return { success: false, message: 'Email already exists'};
        }
        
        const user: UserEntity = await this.userRepo.create({  displayName, username,  password, email, isActive, role});
        return await this.userRepo.save(user);
    }
}
