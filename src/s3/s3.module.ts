import { Module, forwardRef } from '@nestjs/common';
import { S3ClientConfig, S3Client } from '@aws-sdk/client-s3';
import { AttendeeController } from '../attendees/attendees.controller';
import { S3Service } from './s3.service';
import { AttendeesModule } from '../attendees/attendees.module';
import { AttendeeService } from '../attendees/attendees.service';

const s3ClientConfig: S3ClientConfig = {
  region: process.env.AWS_REGION,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  },
};

const s3Client = new S3Client(s3ClientConfig);

@Module({
  imports: [forwardRef(() => AttendeesModule)], // Import AttendeesModule here
  providers: [
    S3Service,
    { provide: 'S3Client', useValue: s3Client },
    AttendeeService,
  ],
  exports: [S3Service],
})
export class S3ModuleModule {}
