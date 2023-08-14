import { S3Client } from '@aws-sdk/client-s3';
import { Test, TestingModule } from '@nestjs/testing';
import { S3Service } from './s3.service';

describe('S3ModuleService', () => {
  let service: S3Service;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [],
      providers: [{ provide: 'S3Client', useValue: new S3Client() }, S3Service],
    }).compile();

    service = module.get<S3Service>(S3Service);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
