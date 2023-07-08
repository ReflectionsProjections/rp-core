import { Injectable, Inject } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { Express } from 'express';
import { v4 as uuidv4 } from 'uuid';
import * as dotenv from 'dotenv';

@Injectable()
export class S3ModuleService {
  private readonly bucket: string;
  private readonly accessKeyId: string;
  private readonly secretAccessKey: string;

  constructor(@Inject('S3Client') private readonly s3Client: S3Client) {
    dotenv.config(); // Load environment variables from .env file
    this.bucket = process.env.AWS_S3_BUCKET;
    this.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    this.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    console.log("BUCKET: " + this.bucket);
    console.log("ACCESS: " + this.accessKeyId);
    console.log("SECRET: " + this.secretAccessKey);
  }

  async uploadFile(file: Express.Multer.File, bucket: string) {
    const { originalname, buffer, mimetype } = file;

    // Generate a unique file key using UUID
    const key = `${uuidv4()}_${originalname}`;

    const params = {
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ACL: 'public-read',
      ContentType: mimetype,
      ContentDisposition: 'inline',
    };

    try {
      const s3Response = await this.s3Client.send(new PutObjectCommand(params));
      console.log(s3Response);
      return { success: true, message: 'File uploaded successfully', key };
    } catch (error) {
      console.log(error);
      throw new Error('Failed to upload file to S3');
    }
  }
}
