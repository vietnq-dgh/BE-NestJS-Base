import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { PublicModules } from 'src/common/PublicModules';

@Module({
  imports: [
    PublicModules.PASSPORT_MODULE,
  ],
  controllers: [CategoryController],
  providers: [CategoryService]
})
export class CategoryModule {}
