import { HttpStatus } from "@nestjs/common";
import { RolerUser } from "./Enums";
import { TaskRes } from "./Classess";
import * as bcrypt from 'bcrypt';
import * as Dics from './MyDictionary.json'

class PublicModules {
    fun_isAuthClient = (req) => {
        const task = new TaskRes();
        const who = req.user.role;
        if (who === RolerUser[RolerUser.CLIENT]) {
            task.statusCode = HttpStatus.UNAUTHORIZED;
            task.message = HttpStatus[HttpStatus.UNAUTHORIZED];
            task.bonus = who;
            return task;
        }
    
        return null;
    };

    fun_isLengthToLong = (str: string, len: number) => {
        const task = new TaskRes();
        str = str.trim();
        if (str == null || str.length == 0 || str.length > len) {
            task.statusCode = HttpStatus.LENGTH_REQUIRED;
            task.message = Dics.LEN_TO_LONG;
            task.bonus = `Length: ${str.length} / ${len}`;
            return task;
        }
    
        return null;
    }

    fun_makeResCreateSucc = (result: any) => {
        const task = new TaskRes();
        task.statusCode = HttpStatus.CREATED;
        task.message = Dics.CREATE_SUCC;
        task.result = result;
        return task;
    }

    fun_makeResUpdateSucc = (bonus: any) => {
        const task = new TaskRes();
        task.statusCode = HttpStatus.CREATED;
        task.message = Dics.UPDATE_SUCC;
        task.bonus = bonus;
        return task;
    }

    fun_makeResFoundSucc = (result: any) => {
        const task = new TaskRes();
        task.statusCode = HttpStatus.OK;
        task.message = Dics.FOUND_OK;
        task.result = result;
        return task;
    }

    fun_makeResNotFound = (bonus: any) => {
        const task = new TaskRes();
        task.statusCode = HttpStatus.NOT_FOUND;
        task.message = Dics.NOT_FOUND;
        task.bonus = bonus;
        return task;
    }

    fun_makeResDeleteSucc = (bonus: any) => {
        const task = new TaskRes();
        task.statusCode = HttpStatus.CREATED;
        task.message = Dics.DELETE_SUCC;
        task.bonus = bonus;
        return task;
    }

    fun_makeResListSucc = (list: Array<any>, total: number, bonus: any) => {
        const task = new TaskRes();
        task.statusCode = HttpStatus.OK;
        task.message = Dics.FOUND_OK;
        task.result = list;
        if (total) {
            task.total = total;
        } else {
            task.total = list.length;
        }
        if (bonus) {
            task.bonus = bonus;
        }
    
        return task;
    };

    fun_makeResError = (bonus: any, mess: any) => {
        const task = new TaskRes();
        task.statusCode = HttpStatus.FAILED_DEPENDENCY;
        if (mess) {
            task.message = mess;
        } else {
            task.message = Dics.FAILED_DEPENDENCY;
        }
        task.bonus = bonus;
        return task;
    }

    fun_hashPassword = async (oldPass) => {
        const newPass = await bcrypt.hash(oldPass, 10);
    
        return newPass;
    };

    fun_isLetter = (char: string) => {
        return char.length === 1 && char.match(/[a-z]/i);
    }

    fun_isDigit = (char: string) => {
        return /^\d+$/.test(char);
    }

    fun_isValidPassword = (passwordCheck: string) => {
        if (passwordCheck == null || passwordCheck.trim().length < 6){
            return false;
        }
        passwordCheck = passwordCheck.trim();
        let countLetter = 0;
        let countDigit = 0;
        for(let i = 0; i < passwordCheck.length; i++){
            const ch = passwordCheck.charAt(i);
            if (this.fun_isDigit(ch)){
                countDigit += 1;
            }
            if (this.fun_isLetter(ch)){
                countLetter += 1;
            }
        }

        return countLetter != 0 && countDigit != 0;
    };
}

export default PublicModules;
