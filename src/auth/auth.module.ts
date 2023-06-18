import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Verification, VerificationSchema } from './verifications.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailModule } from 'src/email/email.module';
import { EmailService } from 'src/email/email.service';
import { AttendeeService } from 'src/attendees/attendees.service';
import { AttendeesModule } from 'src/attendees/attendees.module';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Verification.name, schema: VerificationSchema },
    ]),
    EmailModule,
    AttendeesModule,
  ],
  controllers: [AuthController],
  providers: [AuthService, EmailService, AttendeeService],
  exports: [
    MongooseModule.forFeature([
      { name: Verification.name, schema: VerificationSchema },
    ]),
  ],
})
export class AuthModule {}
