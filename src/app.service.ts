import { HttpStatus, Injectable } from '@nestjs/common';
import { TaskRes } from './common/Classess';
import { MailService } from "./modules/core/mail/mail.service";
import { MailBasicDto } from "./modules/core/mail/dto/mail-basic.dto";

@Injectable()
export class AppService {
  constructor(
    private readonly mailService: MailService,
  ) {}

  getHello(): TaskRes {
    const task = new TaskRes();
    task.success = true;
    task.statusCode = HttpStatus.OK;
    task.message = `Wellcome to the SERVICE: ${process.env.APP_NAME}`;

    return task;
  }

  async testSendMail(emailTo: string): Promise<TaskRes> {
    let task: TaskRes = null;
    const mailDto = new MailBasicDto({
      to: emailTo,
      subject: 'test-send-mail',
      html: 'Test send mail',
    });
    task = await this.mailService.sendMail(mailDto);

    return task;
  }
}
