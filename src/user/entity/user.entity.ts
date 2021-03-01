import { BeforeInsert, Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { Command } from "nestjs-command";

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({
        type: "varchar",
    })
    firstName: string;

    @Column({
        type: "varchar",
    })
    lastName: string;

    @Column({
        type: "varchar",
        nullable: false,
        unique: true
    })  
    email: string;

    @Column({
        type: "varchar",
        nullable: false
    })
    password: string;

    @BeforeInsert()
    async hashPassword(){
        this.password = await bcrypt.hash(this.password, 10);
    }
}