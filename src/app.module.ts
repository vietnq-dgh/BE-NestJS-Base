import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from './orm.config';
import { AuthModule } from './auth/auth.module';
import { CommandModule } from 'nestjs-command';
import { NiceNameController } from './nicename/NiceName.Controller';
import { CategoriesController } from './categories/Categories.Controller';

@Module({
  imports: [TypeOrmModule.forRoot(config), AuthModule, CommandModule,],
  controllers: [
    AppController,
    NiceNameController,
    CategoriesController,
  ],
  providers: [AppService,],
})
export class AppModule { }
