import { Module } from '@nestjs/common';
import { S3ClientConfig, S3Client } from '@aws-sdk/client-s3';
import { S3ModuleController } from './s3-module.controller';
import { S3ModuleService } from './s3-module.service';

const s3ClientConfig: S3ClientConfig = {
  region: process.env.AWS_REGION, 
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
};

const s3Client = new S3Client(s3ClientConfig);

@Module({
  controllers: [S3ModuleController],
  providers: [S3ModuleService, { provide: 'S3Client', useValue: s3Client }],
})
export class S3ModuleModule {}
