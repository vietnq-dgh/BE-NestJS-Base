import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LoginUserDto } from './dto/loginUserDto.dto';
import { UserDto } from './dto/userDto.dto';
import { UserEntity } from './entity/user.entity';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from './dto/createUser.dto';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepo: Repository<UserEntity>, 
    ){}

    async findOne(user: any){
        return await this.userRepo.findOne(user);
    }

    async findByLogin({ email, password}: LoginUserDto){
        const user = await this.userRepo.findOne({where:{email}});
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

    async findByPayload({email}:any){
        return await this.findOne({
            where: { email }
        });
    }

    async create(userDto: CreateUserDto){    
        const { firstName, lastName, email, password } = userDto;
        
        // check if the user exists in the db    
        const userInDb = await this.userRepo.findOne({ 
            where: { email } 
        });

        if (userInDb) {
            throw new HttpException('User already exists', HttpStatus.BAD_REQUEST);    
        }
        
        const user: UserEntity = await this.userRepo.create({ firstName, lastName, password, email, });
        return await this.userRepo.save(user);
    }
}
