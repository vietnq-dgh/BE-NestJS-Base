import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from './orm.config';
import { CommandModule } from 'nestjs-command';
import { UserModule } from './modules/user/user.module';
import { CategoryModule } from './modules/category/category.module';
import { AuthModule } from './modules/auth/auth.module';
import { FilesModule } from './modules/files/files.module';
import { TagNameModule } from './modules/tag-name/tag-name.module';
import { PostModule } from './modules/post/post.module';
import { MailModule } from './modules/core/mail/mail.module';
import { PublicModules } from './common/PublicModules';
import { ChatGateway } from './chat.gateway';

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    PublicModules.PASSPORT_MODULE,
    CommandModule,
    FilesModule,
    AuthModule,
    UserModule,
    CategoryModule,
    TagNameModule,
    PostModule,
    MailModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [
    AppService,
    ChatGateway,
  ],
})
export class AppModule { }
