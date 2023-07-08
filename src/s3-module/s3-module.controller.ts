import { Controller, Post, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3ModuleService } from './s3-module.service';
import { Express } from 'express';

@Controller('upload')
export class S3ModuleController {
  constructor(private readonly s3ModuleService: S3ModuleService) {}

  @Post()
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File) {
    try {
      await this.s3ModuleService.uploadFile(file);
      return { success: true, message: 'File uploaded successfully' };
    } catch (error) {
      return { success: false, message: 'Failed to upload file', error };
    }
  }
}
