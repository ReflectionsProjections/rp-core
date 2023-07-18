import { Injectable, Inject } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';

@Injectable()
export class S3ModuleService {
  private readonly bucket: string;
  private readonly accessKeyId: string;
  private readonly secretAccessKey: string;

  constructor(@Inject('S3Client') private readonly s3Client: S3Client) {
    this.bucket = process.env.AWS_S3_BUCKET;
    this.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    this.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;
  }

  async uploadFile(file: Express.Multer.File, bucket: string, attendeeID: string) {
    const { originalname, buffer, mimetype } = file;

    const key = `${attendeeID}_${originalname}`;

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
      return { success: true, message: 'File uploaded successfully', key };
    } catch (error) {
      throw new Error('Failed to upload file to S3');
    }
  }
}
