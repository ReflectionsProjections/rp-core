import { S3Client } from '@aws-sdk/client-s3';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Attendee, AttendeeSchema } from '../attendees/attendees.schema';
import { AttendeeService } from '../attendees/attendees.service';
import { S3ModuleModule } from '../s3/s3.module';
import { S3Service } from '../s3/s3.service';
import { CarpController } from './carp.controller';
import { CarpService } from './carp.service';
import { AttendeesModule } from '../attendees/attendees.module';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [S3ModuleModule, AttendeesModule, RolesModule],
  controllers: [CarpController],
  providers: [
    CarpService,
    AttendeeService,
    S3Service,
    {
      provide: 'S3Client',
      useClass: S3Client,
    },
  ],
  exports: [CarpService],
})
export class CarpModule {}
