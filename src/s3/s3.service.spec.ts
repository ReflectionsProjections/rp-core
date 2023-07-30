import { Test, TestingModule } from '@nestjs/testing';
import { S3ModuleService } from './s3.service';

describe('S3ModuleService', () => {
  let service: S3ModuleService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [S3ModuleService],
    }).compile();

    service = module.get<S3ModuleService>(S3ModuleService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
