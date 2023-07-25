import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { EmailModule } from '../email/email.module';
import { EmailService } from '../email/email.service';
import { AuthService } from './auth.service';
import { AuthModule } from './auth.module';
import { getModelToken } from '@nestjs/mongoose';
import { Verification } from './verifications.schema';
import { Model } from 'mongoose';
import { JwtService } from '@nestjs/jwt';
import { ExecutionContext } from '@nestjs/common';
import { AttendeeService } from '../attendees/attendees.service';

describe('AuthController', () => {
  let controller: AuthController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: EmailService,
          useValue: {
            get: jest.fn((key: string) => {}),
          },
        },
        {
          provide: AttendeeService,
          useValue: {
            get: jest.fn((key: string) => {}),
          },
        },
        {
          provide: getModelToken(Verification.name),
          useValue: Model,
        },
        {
          provide: JwtService,
          useValue: {
            canActivate: jest.fn((context: ExecutionContext) => {
              const req = context.switchToHttp().getRequest();
              req.user = {};
              return true;
            }),
          },
        },
        AuthService,
      ],
      controllers: [AuthController],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
