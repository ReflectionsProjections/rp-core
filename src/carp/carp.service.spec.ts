import { Test, TestingModule } from '@nestjs/testing';
import { CarpService } from './carp.service';
import { S3Service } from '../s3/s3.service';
import { AttendeeService } from '../attendees/attendees.service';
import { S3Client } from '@aws-sdk/client-s3';
import { AppModule } from '../app.module';
import { S3ModuleModule } from '../s3/s3.module';
import { CarpModule } from './carp.module';
import { AttendeesModule } from '../attendees/attendees.module';

describe('CarpService', () => {
  let service: CarpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, S3ModuleModule, CarpModule, AttendeesModule],
      providers: [
        { provide: 'S3Client', useValue: new S3Client() },
        CarpService,
        S3Service,
        AttendeeService,
      ],
    }).compile();

    service = module.get<CarpService>(CarpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
