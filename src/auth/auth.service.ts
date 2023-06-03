import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Verification } from './verifications.schema';
import { Model } from 'mongoose';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

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

    const passcode = crypto.randomInt(100000, 999999).toString();
    console.log('passcode', passcode);

    bcrypt.hash(passcode, this.SALT_ROUNDS, async (err, hash) => {
      if (err) {
        console.error('BCrypt hash failed');
      }

      const result = this.verificationModel.create({
        email,
        passcodeHash: hash,
        expiresAt: Date.now().toLocaleString(),
      });

      console.log('result from insert', result);
    });
  }

  verifyPasscode(email: string, passcode: string) {}

  regenerateVerificationPasscode(email: string) {}

  getLoggedInUser() {}
}
