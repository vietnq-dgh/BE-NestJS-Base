import { HttpStatus, NotFoundException } from "@nestjs/common";
import { TaskRes } from "./Classess";
import * as Dics from './MyDictionary.json'
import { PassportModule } from "@nestjs/passport";
import { join } from "path";
import { uuid } from "uuidv4";
import { User } from "src/entities/user.entity";

require("dotenv").config({ path: '.env' });

const moment = require('moment');

// Nodejs encryption with CTR
const crypto = require('crypto');
const dateTimeFormat = "yyyy/MM/DD HH:mm:ss";

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
      task.error = `Length: ${str.length} / ${len}`;
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

  static fun_makeResCreateErr = (message: string) => {
    const task = new TaskRes();
    task.statusCode = HttpStatus.NOT_FOUND;
    task.success = false;
    task.message = message;
    task.result = message;
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

  static fun_makeResNotFound = (message: string = '') => {
    const task = new TaskRes();
    task.statusCode = HttpStatus.NOT_FOUND;
    task.success = false;
    task.message = message;
    task.error = message;
    return task;
  }

  static fun_makeResAlreadyExist = (error: any, name: string = '') => {
    const task = new TaskRes();
    task.statusCode = HttpStatus.FOUND;
    task.success = false;
    task.message = `${name} ${Dics.ALREADY_EXIST}`;
    task.error = error;
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

  static fun_makeResListSucc = (list: Array<any>, total?: number, error?: any) => {
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
    if (error) {
      task.error = error;
    }

    return task;
  };

  static fun_makeResError = (error: any, mess: any) => {
    const task = new TaskRes();
    task.statusCode = HttpStatus.FAILED_DEPENDENCY;
    task.success = false;
    if (mess)
      task.message = mess;
    else
      task.message = Dics.FAILED_DEPENDENCY;
    if (error)
      task.error = error;
    else
      task.error = Dics.NO_BONUS;
    return task;
  }

  static fun_isLetter = (char: string) => {
    return char.length === 1 && char.match(/[a-z]/i);
  }

  static fun_isDigit = (char: string) => {
    return /^\d+$/.test(char);
  }

  static fun_isValidPassword = (passwordCheck: string) => {
    let task: TaskRes = null;
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
    if (valid) {
      task = PublicModules.fun_makeResCreateSucc(valid);
      return task;
    }

    task = PublicModules.fun_makeResError('To Protect Password ...', Dics.PASSWORD_NON_VALID_MESS);
    return task;
  };

  static fun_getTimeStamp = ({ isISO = false }) => {
    if (isISO)
      return new Date().toISOString();
    return new Date().getTime();
  }

  static fun_getUuid = () => {
    return uuid();
  }

  static fun_renameImage = (originFileName: string) => {
    const fN = originFileName;
    const ext = fN.substring(fN.lastIndexOf('.'), fN.length);
    let newFileName = process.env.APP_NAME + '_' + PublicModules.fun_getTimeStamp({ isISO: true });
    newFileName = newFileName.replace(new RegExp(':', 'g'), '-');
    newFileName += PublicModules.fun_getUuid();
    newFileName += ext;
    return newFileName;
  }

  static fun_saveFile = async (folder: string = '/uploads/images/', fileName: string, data: any) => {
    return new Promise((resolve, reject) => {
      const path = join(process.cwd(), folder);
      const fs = require('fs');
      // folder exists ?
      if (!fs.existsSync(path)) {
        fs.mkdirSync(path);
      }

      fs.writeFile(path + fileName, data, (err: any) => {
        if (err)
          reject(err);
        else
          resolve(fileName);
      })
    });
  };

  static fun_encryptMD5 = (text: string) => {
    const hash = crypto.createHash('md5').update(text).digest('hex');
    return hash;
  };

  static fun_getCurrentTimestampUTC_Moment(isFullDay: boolean = false) {
    if (isFullDay)
      return moment().utc().format(dateTimeFormat);
    var current = moment().utc().valueOf();
    return (current - current % 1000) / 1000;
  };

  static fun_secureUserResponse = (user: User): IUserResponse => {
    const result: IUserResponse = {
      id: user.id,
      email: user.email,
      fullName: user.displayName,
      userName: user.userName,
    }
    return result;
  }

  static fun_getTokenExpired_NumberMilis = () => {
    let expString = process.env.TOKEN_REFRESH_EXPIRESIN;
    const expiredInNumber = Number.parseInt(expString.substring(0, expString.length - 1));
    const result = {
      expiredInDate: new Date(Date.now() + expiredInNumber),
      expiredInNumber,
    };
    return result;
  }

  static fun_momentDiffDays(unit: number) {
    let current = moment();
    if (current.hours() > 0) {
      current = current.add(1, 'days');
      current = current.hours(0);
      current = current.minutes(0);
      current = current.seconds(0);
    }

    return current.diff(moment.unix(unit), 'days');
  }
}
