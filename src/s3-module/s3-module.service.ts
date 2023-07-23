import { Injectable, Inject } from '@nestjs/common';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

@Injectable()
export class S3ModuleService {
  private readonly bucket: string;
  private readonly accessKeyId: string;
  private readonly secretAccessKey: string;

  constructor(@Inject('S3Client') private readonly s3Client: S3Client) {
    this.bucket = process.env.AWS_S3_BUCKET;
  }

  async getPresignedURL(file: Express.Multer.File, attendeeID: string, attendeeName: string): Promise<string> {
    const key = `${attendeeID}_${attendeeName}`;

    const params = {
      Bucket: this.bucket,
      Key: key
    };

    try {
      const command = new PutObjectCommand(params);
      const url = await getSignedUrl(this.s3Client, command, { expiresIn: 3600 });
      return url;
    } catch (error) {
      throw new Error('Failed to generate pre-signed URL');
    }
  }
}
