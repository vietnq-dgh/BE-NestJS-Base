import { ParamsForService } from "src/common/Classess";
import { Category } from "src/common/entities/Category.entity";
import { LEN_OF_FIELDS } from "src/common/Enums";
import PublicModules from "src/common/PublicModules";
import { Repository } from "typeorm";
import * as Dics from '../common/MyDictionary.json';
import { 
    CreateDto,
 } from "./Categories.Dto";

class CategoriesService {
    // **************** DEFAULT ***************
    // Repository
    repo = null as Repository<Category>;
    libs = null as PublicModules;

    // Get Connection
    constructor(params: ParamsForService) {
        this.repo = params.conn.getRepository(Category);
        this.libs = params.libs;
    }
    // **************** DEFAULT ***************

    gets = async () => {
        var task = null;
        task = await this.repo.find({isDelete: false});
        task = this.libs.fun_makeResListSucc(task, null, null);
        return task;
    };

    get = async (id: string) => {
        var task = null;
        // id to long ?
        task = this.libs.fun_isLengthToLong(id, LEN_OF_FIELDS.LENGTH_LOW);
        if (task){
            return task;
        }

        // find
        task = await this.repo.findOne({where: {id: id, isDelete: false}});
        if (!task){
            task = this.libs.fun_makeResNotFound(task);
            return task;
        }

        // ok
        task = this.libs.fun_makeResFoundSucc(task);
        return task;
    };

    post = async (body: CreateDto) => {
        var task = null;
        // is length long ?
        task = this.libs.fun_isLengthToLong(body.name, LEN_OF_FIELDS.LENGTH_LOW);
        if (task){
            return task;
        }

        // name exists ?
        task = await this.repo.findOne({where: {name: body.name, isDelete: false}});
        if (task){
            task = this.libs.fun_makeResError(body.name, Dics.NAME_FOUND);
            return task;
        }

        // add
        const newCate = this.repo.create();
        newCate.name = body.name;
        task = await this.repo.save(newCate);
        task = this.libs.fun_makeResCreateSucc(task);
        return task;
    };

    put = async (id: string, body: CreateDto) => {
        var task = null;
        // id to long ?
        task = this.libs.fun_isLengthToLong(id, LEN_OF_FIELDS.LENGTH_LOW);
        if (task){
            return task;
        }

        // name to long ?
        task = this.libs.fun_isLengthToLong(body.name, LEN_OF_FIELDS.LENGTH_LOW);
        if (task){
            return task;
        }

        // id not found ?
        const find = await this.repo.findOne({where: {id: id, isDelete: false}});
        if (!find){
            task = this.libs.fun_makeResNotFound(id);
            return task;
        }

        // merge
        task = this.repo.merge(find, body);
        task = await this.repo.save(task);
        task = this.libs.fun_makeResUpdateSucc(task);
        return task;
    };

    delete = async (id: string) => {
        var task = null;
        // id to long ?
        task = this.libs.fun_isLengthToLong(id, LEN_OF_FIELDS.LENGTH_LOW);
        if (task){
            return task;
        }

        // id not exists ?
        const find = await this.repo.findOne({where: {id: id, isDelete: false}});
        if (!find){
            task = this.libs.fun_makeResNotFound(id);
            return task;
        }

        // delete!
        find.isDelete = true;
        task = await this.repo.save(find);
        task = this.libs.fun_makeResDeleteSucc(task);
        return task;
    };
}

export default CategoriesService;