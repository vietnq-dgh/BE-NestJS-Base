import { Controller, Post, UseInterceptors, UploadedFile, Get, Res, HttpException, Param } from '@nestjs/common';
import { FilesService } from './files.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { join } from 'path';
import { TaskRes } from 'src/common/Classess';

@Controller('files')
@ApiTags('FILE')
export class FilesController {
  constructor(private readonly filesService: FilesService) { }

  @Post('image/ipfs')
  @ApiOperation({ summary: 'Upload an image to IPFS free' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImageToIpfs(@UploadedFile() file: Express.Multer.File) {
    return await this.filesService.uploadImageToIpfs(file);
  }

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

  @Post('image/ipfs-and-server')
  @ApiOperation({ summary: 'Upload image to ipfs and save on server' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadImageToIpfsAndServer(@UploadedFile() file: Express.Multer.File) {
    return await this.filesService.uploadImageToIpfsAndServer(file);
  }

  @Post('other/ipfs')
  @ApiOperation({ summary: 'Upload other file to IPFS free' })
  @UseInterceptors(FileInterceptor('file'))
  async uploadOtherToIpfs(@UploadedFile() file: Express.Multer.File) {
    return await this.filesService.uploadImageToIpfs(file);
  }
}
