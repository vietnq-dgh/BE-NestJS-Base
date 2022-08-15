import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { TaskRes } from 'src/common/Classess';
import { PublicModules } from 'src/common/PublicModules';
import { MailBasicDto } from './dto/mail-basic.dto';

@Injectable()
export class MailService {
  public readonly SEND_MAIL_PER_USER_IN_SECONDS: number = Number.parseInt(process.env.SEND_MAIL_PER_USER_IN_SECONDS);

  constructor(
    private readonly mailerService: MailerService,
  ) { }

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