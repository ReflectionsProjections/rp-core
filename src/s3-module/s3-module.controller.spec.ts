import { Test, TestingModule } from '@nestjs/testing';
import { S3ModuleController } from './s3-module.controller';

describe('S3ModuleController', () => {
  let controller: S3ModuleController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [S3ModuleController],
    }).compile();

    controller = module.get<S3ModuleController>(S3ModuleController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
