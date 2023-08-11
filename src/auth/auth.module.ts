import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Verification, VerificationSchema } from './verifications.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { EmailModule } from '../email/email.module';
import { EmailService } from '../email/email.service';
import { AttendeeService } from '../attendees/attendees.service';
import { AttendeesModule } from '../attendees/attendees.module';
import { RolesService } from '../roles/roles.service';
import { RolesModule } from '../roles/roles.module';
import { WalletService } from '../wallet/wallet.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Verification.name, schema: VerificationSchema },
    ]),
    EmailModule,
    AttendeesModule,
    RolesModule,
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    EmailService,
    AttendeeService,
    RolesService,
    WalletService,
  ],
  exports: [
    MongooseModule.forFeature([
      { name: Verification.name, schema: VerificationSchema },
    ]),
  ],
})
export class AuthModule {}
