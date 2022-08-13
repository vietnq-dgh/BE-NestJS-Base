import { Injectable } from '@nestjs/common';
import { TaskRes } from 'src/common/Classess';
import { PublicModules } from 'src/common/PublicModules';

@Injectable()
export class FilesService {
  async uploadImageToServer(file: Express.Multer.File, fileName: string = null) {
    let task: TaskRes = null;
    // file ?
    if (!file) {
      task = PublicModules.fun_makeResError(null, 'FILE_NULL');
      return task;
    }

    // rename > file
    const newFileName = fileName || PublicModules.fun_renameImage(file.originalname);

    // upload
    let isError = null;
    const result: any = await PublicModules.fun_saveFile('/uploads/images/', newFileName, file.buffer)
      .catch((e) => {
        isError = e;
      });
    // error ?
    if (isError) {
      task = PublicModules.fun_makeResError(isError, 'UPLOAD_ERROR_BY_USER');
      return task;
    }

    // file response
    const urlView = `${process.env.APP_HOST}:${process.env.PORT}/files/image/${result}`;
    task = PublicModules.fun_makeResCreateSucc(Object.assign({}, {
      fileName: result,
      urlView: urlView,
    }));

    return task;
  }
}
