import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PublicModules } from 'src/common/PublicModules';

@Module({
  imports: [
    PublicModules.PASSPORT_MODULE,
  ],
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
