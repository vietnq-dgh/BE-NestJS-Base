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

@Module({
  imports: [
    TypeOrmModule.forRoot(config),
    CommandModule,
    FilesModule,
    AuthModule,
    UserModule,
    CategoryModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [AppService,],
})
export class AppModule { }
