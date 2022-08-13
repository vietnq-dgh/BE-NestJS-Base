import { HttpStatus, Injectable } from '@nestjs/common';
import { TaskRes } from './common/Classess';

@Injectable()
export class AppService {
  getHello(): TaskRes {
    const task = new TaskRes();
    task.success = true;
    task.statusCode = HttpStatus.OK;
    task.message = `Wellcome to the SERVICE: ${process.env.APP_NAME}`;

    return task;
  }
}
