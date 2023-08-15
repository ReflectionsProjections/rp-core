import { S3Client } from '@aws-sdk/client-s3';
import { Module, forwardRef } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailModule } from '../email/email.module';
import { S3ModuleModule } from '../s3/s3.module';
import { S3Service } from '../s3/s3.service';
import { WalletService } from '../wallet/wallet.service';
import { AttendeeController } from './attendees.controller';
import { Attendee, AttendeeSchema } from './attendees.schema';
import { AttendeeService } from './attendees.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Attendee.name, schema: AttendeeSchema },
    ]),
    forwardRef(() => S3ModuleModule),
    EmailModule,
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
    MongooseModule.forFeature([{ name: Attendee.name, schema: AttendeeSchema }]),
    AttendeeService,
  ],
})
export class AttendeesModule {}