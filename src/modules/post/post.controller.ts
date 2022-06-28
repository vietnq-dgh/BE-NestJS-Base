import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { AuthGuard } from '@nestjs/passport';
import { RolesGaurd } from '../auth/Guards/roles.gaurd';
import { RolerUser } from 'src/common/Enums';

@Controller('post')
@ApiTags('POST')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(AuthGuard(),new RolesGaurd(RolerUser.ADMIN))
  @ApiOperation({summary: 'Push a post into DB role [ ADMIN ]'})
  async create(@Body() createPostDto: CreatePostDto) {
    return await this.postService.create(createPostDto);
  }

  @Get()
  @ApiOperation({summary: 'Get all posts'})
  async findAll() {
    return await this.postService.findAll();
  }

  @Get(':id')
  @ApiOperation({summary: 'Get post by id'})
  findOne(@Param('id') id: number) {
    return this.postService.findOne(id);
  }

  @Put(':id')
  @UseGuards(AuthGuard(),new RolesGaurd(RolerUser.ADMIN))
  @ApiOperation({summary: 'Update post by id role [ ADMIN ]'})
  update(@Param('id') id: string, @Body() updatePostDto: UpdatePostDto) {
    return this.postService.update(+id, updatePostDto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard(),new RolesGaurd(RolerUser.ADMIN))
  @ApiOperation({summary: 'Delete post by id role [ ADMIN ]'})
  remove(@Param('id') id: string) {
    return this.postService.remove(+id);
  }
}
