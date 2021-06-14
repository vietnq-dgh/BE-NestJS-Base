import { Module } from '@nestjs/common';
import { PostService } from './post.service';
import { PostController } from './post.controller';
import { PublicModules } from 'src/common/PublicModules';

@Module({
  imports: [
    PublicModules.PASSPORT_MODULE,
  ],
  controllers: [PostController],
  providers: [PostService]
})
export class PostModule {}
