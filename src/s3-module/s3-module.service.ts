import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { Express } from 'express';

@Injectable()
export class S3ModuleService {
  private s3: S3;
  private bucket: string;

  constructor() {
    this.s3 = new S3({
      accessKeyId: process.env.AWS_S3_ACCESS_KEY,
      secretAccessKey: process.env.AWS_S3_KEY_SECRET,
    });

    this.bucket = process.env.AWS_S3_BUCKET;
  }

  async uploadFile(file: Express.Multer.File) {
    const { originalname, buffer, mimetype } = file;

    const params = {
      Bucket: this.bucket,
      Key: originalname,
      Body: buffer,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
      CreateBucketConfiguration: {
        LocationConstraint: 'ap-south-1',
      },
    };

    try {
      const s3Response = await this.s3.upload(params).promise();
      console.log(s3Response);
    } catch (error) {
      console.log(error);
      throw new Error('Failed to upload file to S3');
    }
  }
}
