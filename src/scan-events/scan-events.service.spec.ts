import { Test, TestingModule } from '@nestjs/testing';
import { ScanEventsService } from './scan-events.service';

describe('ScanEventsService', () => {
  let service: ScanEventsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ScanEventsService],
    }).compile();

    service = module.get<ScanEventsService>(ScanEventsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
