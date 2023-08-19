import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { AuthGuard } from '../auth/auth.guard';
import { EmailService } from '../email/email.service';
import { S3ModuleModule } from '../s3/s3.module';
import { S3Service } from '../s3/s3.service';
import { AttendeeController } from './attendees.controller';
import { Attendee } from './attendees.schema';
import { AttendeeService } from './attendees.service';
import { S3Client } from '@aws-sdk/client-s3';
import { AppModule } from '../app.module';
import { WalletService } from '../wallet/wallet.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { ExecutionContext } from '@nestjs/common';
import { Request } from 'express';
import { URL } from 'url';
import * as mocks from 'node-mocks-http';
import { expect, jest } from '@jest/globals';

describe('AttendeeService', () => {
  let controller: AttendeeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, S3ModuleModule],
      controllers: [AttendeeController],
      providers: [
        { provide: 'S3Client', useValue: new S3Client() },
        AttendeeService,
        {
          provide: getModelToken(Attendee.name),
          useValue: Model,
        },
        {
          provide: EmailService,
          useValue: {
            get: jest.fn((key: string) => {}),
          },
        },
        S3Service,
        {
          provide: WalletService,
          useValue: {
            get: jest.fn((key: string) => {}),
          },
        },
        {
          provide: JwtService,
          useValue: {
            signAsync: jest.fn((obj) => {
              return JSON.stringify(obj);
            }),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const request: Request = context.switchToHttp().getRequest();
          request['user'] = { email: 'test@rp.org' };
          return true;
        },
      })
      .compile();

    controller = module.get<AttendeeController>(AttendeeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('getQRCode generates a data URL', async () => {
    const req = mocks.createRequest();
    req['user'] = { email: 'test@rp.org' };
    expect(await controller.getQRCode(req)).toMatch(/data:/);
  });

  it('getQRCode throws exception when email is absent', async () => {
    const req = mocks.createRequest();
    expect(() => controller.getQRCode(req)).rejects.toThrow();
  });
});
