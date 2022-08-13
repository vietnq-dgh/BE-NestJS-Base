import { Module, Global } from '@nestjs/common';
import { MailerModule } from "@nestjs-modules/mailer";
import { emailsConfig } from 'src/common/configs';
import { HandlebarsAdapter } from "@nestjs-modules/mailer/dist/adapters/handlebars.adapter";
import { MailService } from './mail.service';
import { join } from 'path';

@Global()
@Module({
  imports: [
    MailerModule.forRootAsync({
      useFactory: () => ({
        transport: {
          host: emailsConfig.domain,
          port: emailsConfig.port,
          auth: {
            user: emailsConfig.user,
            pass: emailsConfig.password
          },
          tls: true
        },
        defaults: {
          from: `"${process.env.APP_NAME}" <'${emailsConfig.user}'>`,
        },
        template: {
          dir: join(process.cwd(), '/uploads/mail-templates'),
          adapter: new HandlebarsAdapter(),
          options: {
            strict: true,
          },
        },
      }),
    }),
  ],

  providers: [
    MailService,
  ],

  exports: [
    MailService,
  ],
})
export class MailModule {}
