import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { TaskRes } from 'src/common/Classess';
import { PublicModules } from 'src/common/PublicModules';
import { MailBasicDto } from './dto/mail-basic.dto';

@Injectable()
export class MailService {
  public MAX_OF_DATE = 100;

  constructor(
    private readonly mailerService: MailerService,
  ) {}

  async sendMail(dto: MailBasicDto): Promise<TaskRes> {
    let task: TaskRes = null;
    await this.mailerService
      .sendMail({
        ...dto
      })
      .catch((e) => {
        task = PublicModules.fun_makeResError(e, 'SEND_MAIL_ERROR');
      }).then((data) => {
        task = PublicModules.fun_makeResCreateSucc(data);
      });

    return task;
  }
}