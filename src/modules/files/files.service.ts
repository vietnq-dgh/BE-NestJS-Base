import { Injectable } from '@nestjs/common';
import { TaskRes } from 'src/common/Classess';
import { PublicModules } from 'src/common/PublicModules';
import fs from 'fs';

@Injectable()
export class FilesService {
  async uploadImageToIpfs(file: Express.Multer.File) {
    let task: TaskRes = null;
    // file ?
    if (!file) {
      task = PublicModules.fun_makeResError(null, 'FILE_NULL');
      return task;
    }

    // upload
    const ipfsAPI = require('ipfs-api');
    const ipfs = ipfsAPI(process.env.IPFS_API_HOST, process.env.IPFS_API_PORT, { protocol: process.env.IPFS_API_PROTOCOL });

    let isError = null;
    const result = await ipfs.add(file.buffer).catch((e: any) => {
      isError = e;
    });

    // error ?
    if (isError) {
      task = PublicModules.fun_makeResError(isError, 'UPLOAD_FILE_ERROR_BY_SERVER');
      return task;
    }

    // success ?
    if (result) {
      const fN = file.originalname;
      let url = process.env.IPFS_API_VIEW_IMAGE;
      const ipfsId = result[0].hash;
      url += ipfsId;
      task = PublicModules.fun_makeResCreateSucc(Object.assign({}, {
        urlView: url,
        fileName: ipfsId + fN.substring(fN.lastIndexOf('.'), fN.length),
      }));
      return task;
    }

    task = PublicModules.fun_makeResError(null, 'UPLOAD_FILE_ERROR_BY_IPFS')
    return task;
  }

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

  async uploadImageToIpfsAndServer(file: Express.Multer.File) {
    let task: TaskRes = null;
    const handleUpladToIPFS = await this.uploadImageToIpfs(file);
    // error ?
    if (!handleUpladToIPFS.success) {
      task = PublicModules.fun_makeResError(handleUpladToIPFS.result, handleUpladToIPFS.message);
      return task;
    }

    const handleUploadToServer = await this.uploadImageToServer(file, handleUpladToIPFS.result.fileName);
    // error ?
    if (!handleUploadToServer.success) {
      task = PublicModules.fun_makeResError(handleUploadToServer.result, handleUploadToServer.message);
      return task;
    }

    // ok return fileName
    task = PublicModules.fun_makeResCreateSucc(Object.assign({}, {
      ipfs: handleUpladToIPFS.result,
      server: handleUploadToServer.result,
    }));

    return task;
  }
}
