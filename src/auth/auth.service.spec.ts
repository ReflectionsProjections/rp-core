import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from '../email/email.service';
import { AuthModule } from './auth.module';
import { AuthService } from './auth.service';
import { EmailModule } from '../email/email.module';
import { AttendeeService } from '../attendees/attendees.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';
import { Verification } from './verifications.schema';
import { JwtService } from '@nestjs/jwt';
import { ExecutionContext } from '@nestjs/common';

describe('AuthService', () => {
  let mockVerificationModel: Model<Verification>;
  let authService: AuthService;
  let configService: ConfigService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: getModelToken(Verification.name),
          useValue: Model,
        },
        {
          provide: EmailService,
          useValue: {
            get: jest.fn((key: string) => {}),
          },
        },
      ],
    }).compile();

    mockVerificationModel = module.get<Model<Verification>>(
      getModelToken(Verification.name),
    );
    authService = await module.resolve(AuthService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });
});
