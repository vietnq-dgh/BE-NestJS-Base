import { Injectable } from '@nestjs/common';
import { TaskRes } from 'src/common/Classess';
import { PublicModules } from 'src/common/PublicModules';
import { Category } from 'src/entities/category.entity';
import { Connection, Repository } from 'typeorm';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import * as Dics from 'src/common/MyDictionary.json';
import { plainToClass } from 'class-transformer';

@Injectable()
export class CategoryService {
  private cateRepo: Repository<Category> = null;

  constructor(
    private readonly connection: Connection,
  ) {
    this.cateRepo = this.connection.getRepository(Category);
  }

  getRepo() {
    return this.cateRepo;
  }

  async findByName(name: string){
    return await this.cateRepo.findOne({where: {name: name}});
  }

  async create(dto: CreateCategoryDto) {
    let task: TaskRes = null;
    // unique name
    const find = await this.findByName(dto.name);
    if (find){
      task = PublicModules.fun_makeResError(null, Dics.NAME_FOUND);
      return task;
    }

    // save
    const newCate = plainToClass(Category, dto);
    const result = await this.cateRepo.save(newCate);
    task = PublicModules.fun_makeResCreateSucc(result);

    return task;
  }

  async findAll() {
    let task:TaskRes = null;
    task = PublicModules.fun_makeResListSucc(await this.cateRepo.find());

    return task;
  }

  findOne(id: number) {
    return `This action returns a #${id} category`;
  }

  update(id: number, updateCategoryDto: UpdateCategoryDto) {
    return `This action updates a #${id} category`;
  }

  remove(id: number) {
    return `This action removes a #${id} category`;
  }
}
