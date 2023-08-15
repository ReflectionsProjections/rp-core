import { Test, TestingModule } from '@nestjs/testing';
import { CarpService } from './carp.service';
import { S3Service } from '../s3/s3.service';
import { AttendeeService } from '../attendees/attendees.service';

describe('CarpService', () => {
  let service: CarpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarpService, S3Service, AttendeeService],
    }).compile();

    service = module.get<CarpService>(CarpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
