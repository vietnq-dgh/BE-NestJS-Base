import { HttpStatus, NotFoundException } from "@nestjs/common";
import { TaskRes } from "./Classess";
import * as Dics from './MyDictionary.json'
import { PassportModule } from "@nestjs/passport";
require("dotenv").config({path: '.env'});

export class PublicModules {

  static TOKEN_SECRETKEY = process.env.TOKEN_SECRETKEY;
  static TOKEN_EXPIRESIN = process.env.TOKEN_EXPIRESIN;
  static TOKEN_REFRESH_EXPIRESIN = process.env.TOKEN_REFRESH_EXPIRESIN;

  static PASSPORT_MODULE = PassportModule.register({
    defaultStrategy: 'jwt',
    property: 'user',
    session: false,
  });

  static checkNULL = (obj, name: string = '') => {
    if (!obj)
      throw new NotFoundException(`${name} Not Found!`);
  };

  static fun_isLengthToLong = (str: string, len: number) => {
    const task = new TaskRes();
    str = str.trim();
    if (str == null || str.length == 0 || str.length > len) {
      task.statusCode = HttpStatus.LENGTH_REQUIRED;
      task.success = false;
      task.message = Dics.LEN_TOO_LONG;
      task.bonus = `Length: ${str.length} / ${len}`;
      return task;
    }

    return null;
  }

  static fun_makeResCreateSucc = (result: any) => {
    const task = new TaskRes();
    task.statusCode = HttpStatus.CREATED;
    task.success = true;
    task.message = Dics.CREATE_SUCC;
    task.result = result;
    return task;
  }

  static fun_makeResCreateErr = (result: any) => {
    const task = new TaskRes();
    task.statusCode = HttpStatus.NOT_FOUND;
    task.success = false;
    task.message = Dics.CREATE_ERR;
    task.result = result;
    return task;
  }

  static fun_makeResUpdateSucc = (result: any) => {
    const task = new TaskRes();
    task.statusCode = HttpStatus.CREATED;
    task.success = true;
    task.message = Dics.UPDATE_SUCC;
    task.result = result;
    return task;
  }

  static fun_makeResFoundSucc = (result: any) => {
    const task = new TaskRes();
    task.statusCode = HttpStatus.OK;
    task.success = true;
    task.message = Dics.FOUND_OK;
    task.result = result;
    return task;
  }

  static fun_makeResNotFound = (bonus: any, name:string = '') => {
    const task = new TaskRes();
    task.statusCode = HttpStatus.NOT_FOUND;
    task.success = false;
    task.message = `${name} ${Dics.NOT_FOUND}`;
    task.bonus = bonus;
    return task;
  }

  static fun_makeResAlreadyExist = (bonus: any, name:string = '') => {
    const task = new TaskRes();
    task.statusCode = HttpStatus.FOUND;
    task.success = false;
    task.message = `${name} ${Dics.ALREADY_EXIST}`;
    task.bonus = bonus;
    return task;
  }

  static fun_makeResDeleteSucc = (result: any) => {
    const task = new TaskRes();
    task.statusCode = HttpStatus.CREATED;
    task.success = true;
    task.message = Dics.DELETE_SUCC;
    task.result = result;
    return task;
  }

  static fun_makeResListSucc = (list: Array<any>, total: number, bonus: any) => {
    const task = new TaskRes();
    task.statusCode = HttpStatus.OK;
    task.success = true;
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

  static fun_makeResError = (bonus: any, mess: any) => {
    const task = new TaskRes();
    task.statusCode = HttpStatus.FAILED_DEPENDENCY;
    task.success = false;
    if (mess)
      task.message = mess;
    else
      task.message = Dics.FAILED_DEPENDENCY;
    if (bonus)
      task.bonus = bonus;
    else
      task.bonus = Dics.NO_BONUS;
    return task;
  }

  static fun_isLetter = (char: string) => {
    return char.length === 1 && char.match(/[a-z]/i);
  }

  static fun_isDigit = (char: string) => {
    return /^\d+$/.test(char);
  }

  static fun_isValidPassword = (passwordCheck: string) => {
    let task:TaskRes = null;
    let valid = false;
    if (passwordCheck == null || passwordCheck.trim().length < 6) {
      task = PublicModules.fun_makeResError('To Protect Password ...', Dics.PASSWORD_NON_VALID_MESS);
      return task;
    }
    passwordCheck = passwordCheck.trim();
    let countLetter = 0;
    let countDigit = 0;
    for (let i = 0; i < passwordCheck.length; i++) {
      const ch = passwordCheck.charAt(i);
      if (PublicModules.fun_isDigit(ch)) {
        countDigit += 1;
      }
      if (PublicModules.fun_isLetter(ch)) {
        countLetter += 1;
      }
    }

    valid = countLetter != 0 && countDigit != 0;
    if (valid){
      task = PublicModules.fun_makeResCreateSucc(valid);
      return task;
    }
    
    task = PublicModules.fun_makeResError('To Protect Password ...', Dics.PASSWORD_NON_VALID_MESS);
    return task;
  };
}
