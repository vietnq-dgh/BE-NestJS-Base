import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { config } from './orm.config';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CommandModule } from 'nestjs-command';
import { OauthModule } from './oauth/oauth.module';
@Module({
  imports: [TypeOrmModule.forRoot(config) , UserModule, AuthModule, CommandModule, OauthModule,],
  controllers: [AppController],
  providers: [AppService,],
})
export class AppModule {}
