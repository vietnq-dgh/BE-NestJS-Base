import { NiceName } from "src/common/entities/NiceName.entity";
import { TaskRes } from "src/common/TaskRes";
import { Connection, Repository } from "typeorm";
import { CreateDto, UpdateDto } from "./NiceName.Dto";
import { LEN_OF_FIELDS } from "../common/Enums";
import { HttpStatus } from "@nestjs/common";
import * as Dics from '../common/MyDictionary.json'

const libs = require('../common/PublicModules');

export class NiceNameService {

    // **************** DEFAULT ***************
    // Repository
    repo = null as Repository<NiceName>;

    // Get Connection
    constructor(private readonly conn: Connection) {
        this.repo = conn.getRepository(NiceName);
    }

    // Get Repository
    nNameRepo = this.conn.getRepository(NiceName);
    // **************** DEFAULT ***************
    
    gets = async () => {
        const list =  await this.repo.find();
        const task = libs.fun_makeResListSucc(list, null, null);
        return task;
    };

    get = async (id: string) => {
        let task = new TaskRes();

        // id to long
        const isLong = libs.fun_isLengthToLong(id, LEN_OF_FIELDS.LENGTH_LOW);
        if (isLong){
            return isLong;
        }

        const find = await this.repo.findOne({where: {id: id}});

        // Not found
        if (!find){
            task = libs.fun_makeResNotFound(find);
            return task;
        }

        // found
        task = libs.fun_makeResFoundSucc(find);
        return task;
    };

    add = async (dto: CreateDto) => {
        const task = new TaskRes();

        // name to long?
        const isLong = libs.fun_isLengthToLong(dto.name, LEN_OF_FIELDS.LENGTH_LOW);
        if (isLong){
            return isLong;
        }

        // name exists db?
        const find = await this.nNameRepo.findOne({where: {name: dto.name}});
        if (find){
            task.statusCode = HttpStatus.FOUND;
            task.message = Dics.NAME_FOUND;
            task.bonus = find;
            return task;
        }

        const newNName = this.nNameRepo.create();
        newNName.name = dto.name;
        const save = await this.nNameRepo.save(newNName);
        const res = libs.fun_makeResCreateSucc(save);
        return res;
    };

    put = async (id: string, body: UpdateDto) => {
        var task = null;

        // is long ?
        const isLong = libs.fun_isLengthToLong(id, LEN_OF_FIELDS.LENGTH_LOW);
        if (isLong){
            return isLong;
        }

        // find one if exists
        const find = await this.repo.findOne({where: {id: id}});
        if (!find){
            const task = libs.fun_makeResNotFound(id);
            return task;
        }

        const merge = this.repo.merge(find, body);
        
        //save
        task = await this.repo.save(merge);
        task = libs.fun_makeResUpdateSucc(task);
        return task;
    };

    delete = async (id: string) => {
        var task = null;
        // id long ?
        task = libs.fun_isLengthToLong(id, LEN_OF_FIELDS.LENGTH_LOW);
        if (task){
            return task;
        }

        // find one if exists ?
        const find = await this.repo.findOne({where: {id: id}});
        if (!find){
            task = libs.fun_makeResNotFound(id);
            return task;
        }

        // delete
        task = await this.repo.delete({id: id});
        task = libs.fun_makeResDeleteSucc(task);
        return task;
    }
}