import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Inject, Injectable, Logger } from '@nestjs/common';

@Injectable()
export class S3Service {
  private readonly logger = new Logger(S3Service.name);

  constructor(@Inject('S3Client') private readonly s3Client: S3Client) {}

  async uploadFile(
    file: Express.Multer.File,
    bucket: string,
    attendeeID: string,
    attendeeName: string,
  ) {
    const { originalname, buffer, mimetype } = file;

    const extension = await this.getExtensionFromFilename(originalname);

    const key = `${attendeeID}_${attendeeName}${extension}`;

    const params = {
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: mimetype,
      ContentDisposition: 'inline',
    };

    try {
      await this.s3Client.send(new PutObjectCommand(params));
      return { success: true, message: 'File uploaded successfully', key };
    } catch (error) {
      this.logger.error('An error occurred:', error);
      throw { success: false, message: error };
    }
  }

  async getExtensionFromFilename(filename: string): Promise<string> {
    const lastDotIndex = filename.lastIndexOf('.');
    if (lastDotIndex === -1) {
      return '';
    }
    return filename.substring(lastDotIndex);
  }
}
