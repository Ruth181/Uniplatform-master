import {
  Controller,
  Get,
  Post,
  Res,
  UploadedFile,
  UploadedFiles,
  UseInterceptors,
} from '@nestjs/common';
import { ApiOperation, ApiProduces } from '@nestjs/swagger';
import { FileInterceptor, FilesInterceptor } from '@nestjs/platform-express';
import { MulterValidators } from '@utils/validators/multer.validator';
import { AppService, FileResponseDTO } from './app.service';
import { Response } from 'express';
import { diskStorage } from 'multer';

@Controller()
export class AppController {
  constructor(private readonly appSrv: AppService) {}

  @Get()
  getHello(): { message: string } {
    return { message: 'Hello world' };
  }

  @Get('/health-check')
  healthCheck(@Res() res: Response): void {
    const healthcheck = {
      uptime: process.uptime(),
      message: 'OK',
      timestamp: Date.now(),
    };
    try {
      res.send(healthcheck);
    } catch (ex) {
      healthcheck.message = ex;
      res.status(503).send();
    }
  }

  @ApiOperation({
    description: `
      Upload multiple files under the key: 'files[]'. 
      Maximum of 25 files are allowed.
    `,
  })
  @ApiProduces('json')
  @UseInterceptors(
    FilesInterceptor('files[]', 25, {
      storage: diskStorage({
        destination: './uploads',
        filename: MulterValidators.preserveOriginalFileName,
      }),
      fileFilter: MulterValidators.fileTypeFilter,
    }),
  )
  @Post('/upload-files')
  async uploadMultipleFiles(
    @UploadedFiles() files: Array<Express.Multer.File>,
  ): Promise<FileResponseDTO<string[]>> {
    const filePaths: string[] = files.map((data) => `uploads/${data.filename}`);
    return await this.appSrv.uploadMultipleFiles(filePaths);
  }

  @ApiOperation({
    description: `
      Upload single video under the key: 'file'. 
      Maximum file-size of 5mb
    `,
  })
  @ApiProduces('json')
  @UseInterceptors(
    FileInterceptor('file', {
      storage: diskStorage({
        destination: './uploads',
        filename: MulterValidators.editFileName,
      }),
      // limits: { fileSize: 6000000 },
      limits: { fileSize: 1024 * 1024 * 5 },
      fileFilter: MulterValidators.fileTypeFilter,
    }),
  )
  @Post('/videos/upload')
  async uploadVideo(
    @UploadedFile() file: Express.Multer.File,
  ): Promise<FileResponseDTO<string[]>> {
    const filePath = `uploads/${file.filename}`;
    return await this.appSrv.uploadMultipleFiles([filePath]);
  }
}
