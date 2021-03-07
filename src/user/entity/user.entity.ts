import { BeforeInsert, Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { rolerUser } from "src/common/constant";
import { nice_name } from "./niceName.entity";

@Entity()
export class UserEntity {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type:"varchar"})
    displayName: string;

    @Column({
        type: "varchar",
    })
    username: string;

    @Column({
        type: "varchar",
        nullable: false
    })
    password: string;

    @Column({
        type: "varchar",
        nullable: false,
        unique: true
    })  
    email: string;

    @Column({default:true})
    isActive:boolean;

    @Column('enum',{enum: rolerUser})
    role: rolerUser;

    @CreateDateColumn()
    createAt?:Date;

    @UpdateDateColumn()
    updateAt?:Date

    @ManyToOne(() => nice_name, nice_name => nice_name.name)
    niceName: nice_name;

    @BeforeInsert()
    async hashPassword(){
        this.password = await bcrypt.hash(this.password, 10);
    }
}