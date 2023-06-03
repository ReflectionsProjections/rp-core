import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmailService } from 'src/email/email.service';
import { Verification } from './verifications.schema';
import { ServiceResponse } from 'src/misc-types';
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const dayjs = require('dayjs');

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);

  SALT_ROUNDS = 10;
  PASSCODE_LIFESPAN_MIN = 10;
  ATTEMPTS_ALLOWED = 5;
  COOLDOWN_SECONDS = 60;

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
  async generateVerificationPasscode(email: string): Promise<ServiceResponse> {
    // Reject if passcode has been generated within the last 60 seconds
    const existing = await this.verificationModel.findOne({ email });

    if (existing) {
      const createdAt = dayjs(existing.createdAt);
      const now = dayjs();
      const ageInSeconds = now.diff(createdAt, 's');

      if (ageInSeconds < this.COOLDOWN_SECONDS) {
        return {
          status: HttpStatus.TOO_MANY_REQUESTS,
          message:
            'A one-time code was recently sent to this email. Try again later.',
        };
      }
    }

    // Delete any old verification instances for this email
    await this.verificationModel.deleteMany({ email });

    // Create a secure six digit passcode
    const passcode = crypto.randomInt(100000, 999999).toString();

    const hash = await bcrypt.hash(passcode, this.SALT_ROUNDS);

    const result = await this.verificationModel.create({
      email,
      passcodeHash: hash,
      expiresAt: dayjs().add(this.PASSCODE_LIFESPAN_MIN, 'm').toISOString(),
      createdAt: dayjs().toISOString(),
      remainingAttempts: this.ATTEMPTS_ALLOWED,
    });

    if (!result) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Could not create Verification Instance',
      };
    }

    await this.emailService.sendBasicEmail({
      to: email,
      subject: `${passcode} is your R|P code`,
      text: `Your one-time code is ${passcode}. This is valid for the next 10 minutes.`,
    });

    this.logger.log('Successfully sent verification email');
    return { status: HttpStatus.OK, message: 'Success' };
  }

  async verifyPasscode(
    email: string,
    passcode: string,
  ): Promise<ServiceResponse> {
    const verifyInstance = await this.verificationModel.findOne({ email });

    if (!verifyInstance) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'No valid one-time codes exist for this email address',
      };
    }

    const match = await bcrypt.compare(passcode, verifyInstance.passcodeHash);

    if (!match) {
      if (verifyInstance.remainingAttempts == 1) {
        await this.verificationModel.deleteOne({ email });
      } else {
        await this.verificationModel.updateOne(
          { email },
          { remainingAttempts: verifyInstance.remainingAttempts - 1 },
        );
      }

      return {
        status: HttpStatus.UNAUTHORIZED,
        message: 'This passcode is incorrect',
      };
    } else {
      const response = await this.verificationModel.deleteOne({ email });
      if (response.deletedCount == 1) {
        return { status: HttpStatus.OK, message: 'Success' };
      }
    }
  }

  getLoggedInUser() {}
}
