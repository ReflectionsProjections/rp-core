// import { Injectable, Inject } from '@nestjs/common';
// import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
// import { getSignedUrl } from '@aws-sdk/s3-request-presigner';

// @Injectable()
// export class S3ModuleService {
//   private readonly bucket: string;

//   constructor(@Inject('S3Client') private readonly s3Client: S3Client) {
//     this.bucket = process.env.AWS_S3_BUCKET;
//   }

//   async getPresignedURL(attendeeID: string, attendeeName: string): Promise<string> {
//     const key = `${attendeeID}_${attendeeName}`;

//     const params = {
//       Bucket: this.bucket,
//       Key: key,
//       ContentType: 'application/pdf'
//     };

//     try {
//       const command = new PutObjectCommand(params);
//       const url = await getSignedUrl(this.s3Client, command, { expiresIn: 300 });
//       return url;
//     } catch (error) {
//       throw new Error('Failed to generate pre-signed URL');
//     }
//   }
// }

import { Injectable, Inject } from '@nestjs/common';
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import {
  getSignedUrl,
} from "@aws-sdk/s3-request-presigner";

@Injectable()
export class S3Service {
  private readonly bucket: string;
  private readonly accessKeyId: string;
  private readonly secretAccessKey: string;

  constructor(@Inject('S3Client') private readonly s3Client: S3Client) {
    this.bucket = process.env.AWS_S3_BUCKET;
    this.accessKeyId = process.env.AWS_ACCESS_KEY_ID;
    this.secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY;

    console.log('BUCKET: ' + this.bucket);
    console.log('ACCESS: ' + this.accessKeyId);
    console.log('SECRET: ' + this.secretAccessKey);
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
      console.log(s3Response);
      return { success: true, message: 'File uploaded successfully', key };
    } catch (error) {
      console.log(error);
      throw new Error('Failed to upload file to S3');
    }
  }

  async getFileUrl(attendeeId: string, attendeeName: string) {
    // TODO change key according to file naming
    const key = `${attendeeId}_${attendeeName}.pdf`;
    try{
      const command = new GetObjectCommand({ Bucket: this.bucket, Key: key});
      // Expires in 12 hours
      const url = getSignedUrl(this.s3Client, command, {expiresIn: 43200});
      return { id: attendeeId, url: url };
    } catch (error) {
      console.log(error);
      throw new Error('Failed to get url');
    }
  }
}


