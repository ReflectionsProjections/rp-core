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
    const bucketName: string = process.env.AWS_S3_BUCKET; // Replace with your bucket name

    try {
      const uploadResult = await this.s3ModuleService.uploadFile(file, bucketName);
      return { success: true, message: 'File uploaded successfully', key: uploadResult.key };
    } catch (error) {
      return { success: false, message: 'Failed to upload file', error };
    }
  }
}

