import { Module, forwardRef } from '@nestjs/common';
import { AttendeeController } from './attendees.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Attendee, AttendeeSchema } from './attendees.schema';
import { AttendeeService } from './attendees.service';
import { S3ModuleModule } from '../s3/s3.module';
import { S3Service } from '../s3/s3.service';
import { S3Client } from '@aws-sdk/client-s3';
import { WalletService } from '../wallet/wallet.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Attendee.name, schema: AttendeeSchema },
    ]),
    forwardRef(() => S3ModuleModule),
  ],
  controllers: [AttendeeController],
  providers: [
    AttendeeService,
    S3Service,
    {
      provide: 'S3Client',
      useClass: S3Client,
    },
    WalletService,
  ],
  exports: [
    MongooseModule.forFeature([
      { name: Attendee.name, schema: AttendeeSchema },
    ]),
    AttendeeService,
  ],
})
export class AttendeesModule {}
