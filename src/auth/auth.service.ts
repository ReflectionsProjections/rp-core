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

  /**
   * Generates a secure 6 digit one time passcode, stores an encrypted copy in DB, and sends it to the provided email.
   *
   * Rejects if a code has already been sent in the last 30 seconds.
   * Does NOT Reject if email does not belong to registered user.
   */
  async generateVerificationPasscode(email: string) {
    // TODO Reject if code has been generated within the last 30 seconds

    // Delete any old verification instances for this email
    await this.verificationModel.deleteMany({ email });

    // Create a secure six digit passcode
    const passcode = crypto.randomInt(100000, 999999).toString();

    bcrypt.hash(passcode, this.SALT_ROUNDS, async (err, hash: string) => {
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
        this.emailService
          .sendBasicEmail({
            to: email,
            subject: `${passcode} is your R|P code`,
            text: `Your one-time code is ${passcode}. This is valid for the next 10 minutes.`,
          })
          .then(() => {
            console.log('Successfully sent verification email');
          });
      }
    });
  }

  async verifyPasscode(email: string, passcode: string) {
    const result = await this.verificationModel.findOne({ email });
  }

  regenerateVerificationPasscode(email: string) {}

  getLoggedInUser() {}
}
