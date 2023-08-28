import { Test, TestingModule } from '@nestjs/testing';
import { CarpService } from './carp.service';
import { S3Service } from '../s3/s3.service';
import { AttendeeService } from '../attendees/attendees.service';
import { S3Client } from '@aws-sdk/client-s3';
import { AppModule } from '../app.module';
import { S3ModuleModule } from '../s3/s3.module';
import { CarpModule } from './carp.module';
import { AttendeesModule } from '../attendees/attendees.module';
import { EmailService } from '../email/email.service';
import { EmailModule } from '../email/email.module';
import { ConfigModule } from '@nestjs/config';
import { ConfigService } from 'aws-sdk';

describe('CarpService', () => {
  let service: CarpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [
        { provide: S3Service, useValue: {} },
        { provide: AttendeeService, useValue: {} },
        CarpService,
      ],
    }).compile();

    service = module.get<CarpService>(CarpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
