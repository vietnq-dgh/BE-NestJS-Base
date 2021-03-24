import { NiceName } from "src/common/entities/NiceName.entity";
import { ParamsForService, TaskRes } from "src/common/Classess";
import { Repository } from "typeorm";
import { CreateDto } from "./NiceName.Dto";
import { LEN_OF_FIELDS } from "../common/Enums";
import { HttpStatus } from "@nestjs/common";
import * as Dics from '../common/MyDictionary.json'
import PublicModules from "src/common/PublicModules";

export class NiceNameService {

    // **************** DEFAULT ***************
    // Repository
    repo = null as Repository<NiceName>;
    libs = null as PublicModules;

    // Get Connection
    constructor(params: ParamsForService) {
        this.repo = params.conn.getRepository(NiceName);
        this.libs = params.libs;
    }
    // **************** DEFAULT ***************
    
    gets = async () => {
        const list =  await this.repo.find({where: {isDelete: false}});
        const task = this.libs.fun_makeResListSucc(list, null, null);
        return task;
    };

    get = async (id: string) => {
        let task = new TaskRes();

        // id to long
        const isLong = this.libs.fun_isLengthToLong(id, LEN_OF_FIELDS.LENGTH_LOW);
        if (isLong){
            return isLong;
        }

        const find = await this.repo.findOne({where: {id: id, isDelete: false}});

        // Not found
        if (!find){
            task = this.libs.fun_makeResNotFound(find);
            return task;
        }

        // found
        task = this.libs.fun_makeResFoundSucc(find);
        return task;
    };

    add = async (dto: CreateDto) => {
        const task = new TaskRes();

        // name to long?
        const isLong = this.libs.fun_isLengthToLong(dto.name, LEN_OF_FIELDS.LENGTH_LOW);
        if (isLong){
            return isLong;
        }

        // name exists db?
        const find = await this.repo.findOne({where: {name: dto.name, isDelete: false}});
        if (find){
            task.statusCode = HttpStatus.FOUND;
            task.message = Dics.NAME_FOUND;
            task.bonus = find;
            return task;
        }

        const newNName = this.repo.create();
        newNName.name = dto.name;
        const save = await this.repo.save(newNName);
        const res = this.libs.fun_makeResCreateSucc(save);
        return res;
    };

    put = async (id: string, body: CreateDto) => {
        var task = null;

        // is long ?
        const isLong = this.libs.fun_isLengthToLong(id, LEN_OF_FIELDS.LENGTH_LOW);
        if (isLong){
            return isLong;
        }

        // find one if exists
        const find = await this.repo.findOne({where: {id: id, isDelete: false}});
        if (!find){
            const task = this.libs.fun_makeResNotFound(id);
            return task;
        }

        const merge = this.repo.merge(find, body);
        
        //save
        task = await this.repo.save(merge);
        task = this.libs.fun_makeResUpdateSucc(task);
        return task;
    };

    delete = async (id: string) => {
        var task = null;
        // id long ?
        task = this.libs.fun_isLengthToLong(id, LEN_OF_FIELDS.LENGTH_LOW);
        if (task){
            return task;
        }

        // find one if exists ?
        const find = await this.repo.findOne({where: {id: id, isDelete: false}});
        if (!find){
            task = this.libs.fun_makeResNotFound(id);
            return task;
        }

        // delete
        find.isDelete = true;
        task = await this.repo.save(find)
        task = this.libs.fun_makeResDeleteSucc(task);
        return task;
    }
}