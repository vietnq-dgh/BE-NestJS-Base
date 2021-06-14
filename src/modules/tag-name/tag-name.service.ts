import { Injectable } from '@nestjs/common';
import { TaskRes } from 'src/common/Classess';
import { PublicModules } from 'src/common/PublicModules';
import { TagName } from 'src/entities/tagname.entity';
import { Connection, Repository } from 'typeorm';
import { CreateTagNameDto } from './dto/create-tag-name.dto';
import * as Dics from 'src/common/MyDictionary.json';
import { plainToClass } from 'class-transformer';

@Injectable()
export class TagNameService {
  private tagRepo: Repository<TagName> = null;

  constructor(
    private readonly connection: Connection,
  ) {
    this.tagRepo = this.connection.getRepository(TagName);
  }

  getRepo() {
    return this.tagRepo;
  }

  async findByName(name: string) {
    return await this.tagRepo.findOne({ where: { name: name } });
  }

  async create(dto: CreateTagNameDto) {
    let task: TaskRes = null;
    // unique name ?
    const find = await this.findByName(dto.name);
    if (find) {
      task = PublicModules.fun_makeResError(null, Dics.NAME_FOUND);
      return task;
    }

    // save
    const newTag = plainToClass(TagName, dto);
    const result = await this.tagRepo.save(newTag);
    task = PublicModules.fun_makeResCreateSucc(result);

    return task;
  }

  async findAll() {
    let task: TaskRes = null;
    task = PublicModules.fun_makeResListSucc(await this.tagRepo.find());

    return task;
  }
}
