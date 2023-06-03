import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Verification } from './verifications.schema';
import { Model } from 'mongoose';
const crypto = require('crypto');
const bcrypt = require('bcrypt');

@Injectable()
export class AuthService {
  SALT_ROUNDS = 10;

  constructor(
    @InjectModel(Verification.name)
    private verificationModel: Model<Verification>,
  ) {}

  async generateVerificationPasscode(email: string) {
    // At this point there may or may not be an attendee object.
    // We simply care about sending an email with the code.

    // TODO Reject if code has been generated within the last 10 seconds

    // Create a secure six digit passcode
    const passcode = crypto.randomInt(100000, 999999).toString();

    bcrypt.hash(passcode, this.SALT_ROUNDS, async (err, hash) => {
      if (err) {
        console.error('BCrypt hash failed!');
      }

      // TODO: Update expiredAt
      this.verificationModel
        .create({
          email,
          passcodeHash: hash,
          expiresAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
        })
        .then((result) => {
          console.log('result', result);
        });
    });
  }

  verifyPasscode(email: string, passcode: string) {}

  regenerateVerificationPasscode(email: string) {}

  getLoggedInUser() {}
}
