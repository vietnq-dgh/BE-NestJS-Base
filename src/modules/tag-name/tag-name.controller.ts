import { Controller, Get, Post, Body, UseGuards } from '@nestjs/common';
import { TagNameService } from './tag-name.service';
import { CreateTagNameDto } from './dto/create-tag-name.dto';
import { AuthGuard } from '@nestjs/passport';
import { RolesGaurd } from '../auth/Guards/roles.gaurd';
import { RolerUser } from 'src/common/Enums';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('tag-name')
@ApiTags('TAG-NAME')
export class TagNameController {
  constructor(private readonly tagNameService: TagNameService) {}

  @Post()
  @UseGuards(AuthGuard(), new RolesGaurd(RolerUser.ADMIN))
  @ApiOperation({summary: 'Create a tag-name role [ADMIN]'})
  create(@Body() createTagNameDto: CreateTagNameDto) {
    return this.tagNameService.create(createTagNameDto);
  }

  @Get()
  @ApiOperation({summary: 'Get all tag-name'})
  findAll() {
    return this.tagNameService.findAll();
  }
}
