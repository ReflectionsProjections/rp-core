import { Test, TestingModule } from '@nestjs/testing';
import { AuthGuard } from '../auth/auth.guard';
import { CarpController } from './carp.controller';
import { CarpService } from './carp.service';

describe('CarpController', () => {
  let controller: CarpController;
  beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        controllers: [CarpController],
        providers: [CarpService],
      })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: (_context) => true,
      })
      .compile();

      controller = module.get<CarpController>(CarpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
