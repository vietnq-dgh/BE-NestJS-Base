import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RolerUser } from 'src/common/Enums';
import { RolesGaurd } from '../auth/Guards/roles.gaurd';
import { CategoryService } from './category.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Controller('category')
@ApiTags('CATEGORY')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @ApiOperation({summary: 'Create new category role [ ADMIN ]'})
  @UseGuards(AuthGuard(), new RolesGaurd(RolerUser.ADMIN))
  create(@Body() createCategoryDto: CreateCategoryDto) {
    return this.categoryService.create(createCategoryDto);
  }

  @Get()
  @ApiOperation({summary: 'Get list category'})
  findAll() {
    return this.categoryService.findAll();
  }

  @Get(':id')
  @ApiOperation({summary: 'Get category by id role [ ADMIN, MOD ]'})
  @UseGuards(AuthGuard())
  findOne(@Param('id') id: string) {
    return this.categoryService.findOne(+id);
  }

  @Put(':id')
  @ApiOperation({summary: 'Update a category role [ ADMIN ]'})
  @UseGuards(AuthGuard())
  update(@Param('id') id: string, @Body() updateCategoryDto: UpdateCategoryDto) {
    return this.categoryService.update(+id, updateCategoryDto);
  }

  @Delete(':id')
  @ApiOperation({summary: 'Delete a category role [ ADMIN ]'})
  @UseGuards(AuthGuard())
  remove(@Param('id') id: string) {
    return this.categoryService.remove(+id);
  }
}
