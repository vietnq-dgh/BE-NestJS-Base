import { Controller, Post, UseInterceptors, UploadedFile, Get, Res, Param } from '@nestjs/common';
import { FilesService } from './files.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';

@Controller('files')
@ApiTags('FILE')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @Post('image/server')
  @ApiOperation({ summary: 'Upload an image to SERVER' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImageToServer(@UploadedFile() file: Express.Multer.File) {
    return await this.filesService.uploadImageToServer(file);
  }

  @Get('image/:name')
  @ApiOperation({ summary: 'View image by image name' })
  async viewImage(@Param('name') imageName: string, @Res() res: any) {
    const path = join(process.cwd(), '/uploads/images/' + imageName);
    const fs = require("fs");
    if (!fs.existsSync(path))
      return await res.sendFile(join(process.cwd(), '/uploads/common/IMAGE_NOT_FOUND.png'));
    return res.sendFile(path);
  }
}
