import { Injectable } from '@nestjs/common';
import { TaskRes } from 'src/common/Classess';
import { PublicModules } from 'src/common/PublicModules';
import { Post } from 'src/entities/post.entity';
import { Connection, Repository } from 'typeorm';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import * as Dics from 'src/common/MyDictionary.json';
import { plainToClass } from 'class-transformer';

@Injectable()
export class PostService {
  private postRepo: Repository<Post> = null;

  constructor(
    private readonly connection: Connection,
  ) {
    this.postRepo = this.connection.getRepository(Post);
  }

  getRepo() {
    return this.postRepo;
  }

  async findByTitle(title: string) {
    return await this.postRepo.findOne({ where: { title: title } });
  }

  async findById(id: number) {
    return await this.postRepo.findOne({ where: { id: id } });
  }

  async create(dto: CreatePostDto) {
    let task: TaskRes = null;
    const find = await this.findByTitle(dto.title);
    if (find) {
      task = PublicModules.fun_makeResError(null, Dics.TITLE_FOUND);
      return task;
    }

    // save
    const newPost = plainToClass(Post, dto);
    const result = await this.postRepo.save(newPost);
    task = PublicModules.fun_makeResCreateSucc(result);

    return task;
  }

  async findAll() {
    let task: TaskRes = null;
    task = PublicModules.fun_makeResListSucc(await this.postRepo.find());

    return task;
  }

  async findOne(id: number) {
    let task: TaskRes = null;
    const find = await this.findById(id);
    if (!find) {
      task = PublicModules.fun_makeResNotFound('POST not found');
      return task;
    }
    task = PublicModules.fun_makeResFoundSucc(find);

    return task;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
