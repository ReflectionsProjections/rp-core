import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Verification, VerificationSchema } from './verifications.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailModule } from 'src/email/email.module';
import { EmailService } from 'src/email/email.service';
import { AttendeeService } from 'src/attendees/attendees.service';
import { AttendeesModule } from 'src/attendees/attendees.module';
import { S3ModuleModule } from 'src/s3/s3.module';
import { S3Service } from 'src/s3/s3.service';
import { S3Client } from '@aws-sdk/client-s3';
import { RolesService } from '../roles/roles.service';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Verification.name, schema: VerificationSchema },
    ]),
    EmailModule,
    AttendeesModule,
    S3ModuleModule,
    RolesModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, 
    EmailService, 
    AttendeeService,
    RolesService,
    S3Service,
    {
      provide: 'S3Client',
      useClass: S3Client,
    }],
  exports: [
    MongooseModule.forFeature([
      { name: Verification.name, schema: VerificationSchema },
    ]),
  ],
})
export class AuthModule {}
