import { Test, TestingModule } from '@nestjs/testing';
import { CarpService } from './carp.service';

describe('CarpService', () => {
  let service: CarpService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CarpService],
    }).compile();

    service = module.get<CarpService>(CarpService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
