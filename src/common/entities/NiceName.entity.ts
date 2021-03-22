import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";
import { LEN_OF_FIELDS } from "../Enums";

@Entity()
export class NiceName{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({type: 'varchar', length: LEN_OF_FIELDS.LENGTH_LOW})
    name:string;

    @Column({type: "bool", default: false})
    isDelete: boolean;
}