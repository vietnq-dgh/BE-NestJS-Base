import { BeforeInsert, Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { RolerUser } from "src/common/Enums";

@Entity()
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type:"varchar", length: 100})
    displayName: string;

    @Column({
        type: "varchar",
        length: 100,
    })
    username: string;

    @Column({
        type: "varchar",
        nullable: false,
        length: 100,
    })
    password: string;

    @Column({
        type: "varchar",
        nullable: false,
        length: 100,
    })  
    email: string;

    @Column('enum',{enum: RolerUser})
    role: RolerUser;

    @CreateDateColumn()
    createAt?:Date;

    @UpdateDateColumn()
    updateAt?:Date

    @Column({type: "varchar", nullable: true, length: 100})
    niceName: string;

    @Column({default:true})
    isActive:boolean;

    @Column({type: "bool", default: false})
    isDelete: boolean;

    @BeforeInsert()
    async hashPassword(){
        this.password = await bcrypt.hash(this.password, 10);
    }
}