import { Module } from '@nestjs/common';
import { TagNameService } from './tag-name.service';
import { TagNameController } from './tag-name.controller';
import { PublicModules } from 'src/common/PublicModules';

@Module({
  imports: [
    PublicModules.PASSPORT_MODULE,
  ],
  controllers: [TagNameController],
  providers: [TagNameService]
})
export class TagNameModule {}
