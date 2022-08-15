import { BeforeInsert, Column, CreateDateColumn, DeleteDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import * as bcrypt from 'bcrypt';
import { RolerUser } from "src/common/Enums";

@Entity()
export class User {
  @PrimaryGeneratedColumn('increment')
  id: number;

  @Column({ type: "varchar", length: 100 })
  displayName: string;

  @Column({
    type: "varchar",
    length: 100,
  })
  userName: string;

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

  @Column('enum', { enum: RolerUser, default: RolerUser.MEM },)
  role: RolerUser;

  @CreateDateColumn()
  createAt?: Date;

  @UpdateDateColumn()
  updateAt?: Date

  @Column({ type: "varchar", nullable: true, length: 100 })
  niceName: string;

  @Column({ default: false })
  isActive: boolean;

  @DeleteDateColumn()
  deleteAt: Date;

  @BeforeInsert()
  async hashPassword() {
    this.password = await bcrypt.hash(this.password, 10);
  }

  @Column({ nullable: true, default: 0 })
  lastSendMailActive: number;

  @Column({ nullable: true, default: 0 })
  lastSendMailRecover: number;
}