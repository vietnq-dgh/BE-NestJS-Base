import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from './orm.config';
import { CommandModule } from 'nestjs-command';
import { UserModule } from './modules/user/user.module';
import { CategoryModule } from './modules/category/category.module';

@Module({
  imports: [
    TypeOrmModule.forRoot(config), 
    CommandModule,
    UserModule,
    CategoryModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [AppService,],
})
export class AppModule { }
