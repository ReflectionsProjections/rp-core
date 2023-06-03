import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Verification } from './verifications.schema';
import { Model } from 'mongoose';
import { EmailService } from 'src/email/email.service';
const crypto = require('crypto');
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  SALT_ROUNDS = 10;

  constructor(
    @InjectModel(Verification.name)
    private verificationModel: Model<Verification>,
    private emailService: EmailService,
  ) {}

  async generateVerificationPasscode(email: string) {
    // At this point there may or may not be an attendee object associated with this email
    // We simply care about sending an email with the code.

    // TODO Reject if code has been generated within the last 30 seconds

    // Delete any old verification instances for this email
    await this.verificationModel.deleteMany({ email });

    // Create a secure six digit passcode
    const passcode = crypto.randomInt(100000, 999999).toString();

    bcrypt.hash(passcode, this.SALT_ROUNDS, async (err, hash) => {
      if (err) {
        console.error('BCrypt hash failed!');
      }

      // TODO: Update expiredAt
      const result = await this.verificationModel.create({
        email,
        passcodeHash: hash,
        expiresAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      });

      if (result) {
        console.log('Successfully created DB Verification entry');
        this.emailService.sendBasicEmail({
          to: email,
          subject: `${passcode} is your R|P code`,
          text: `Your one-time code is ${passcode}. This is valid for the next 10 minutes.`,
        });
      }
    });
  }

  verifyPasscode(email: string, passcode: string) {}

  regenerateVerificationPasscode(email: string) {}

  getLoggedInUser() {}
}
