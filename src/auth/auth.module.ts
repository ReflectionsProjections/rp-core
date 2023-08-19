import { S3Client } from '@aws-sdk/client-s3';
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AttendeesModule } from '../attendees/attendees.module';
import { AttendeeService } from '../attendees/attendees.service';
import { EmailModule } from '../email/email.module';
import { RolesModule } from '../roles/roles.module';
import { RolesService } from '../roles/roles.service';
import { S3ModuleModule } from '../s3/s3.module';
import { S3Service } from '../s3/s3.service';
import { WalletService } from '../wallet/wallet.service';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Verification, VerificationSchema } from './verifications.schema';

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
  providers: [
    AuthService,
    AttendeeService,
    RolesService,
    S3Service,
    {
      provide: 'S3Client',
      useClass: S3Client,
    },
    WalletService,
  ],
  exports: [
    MongooseModule.forFeature([
      { name: Verification.name, schema: VerificationSchema },
    ]),
  ],
})
export class AuthModule {}
