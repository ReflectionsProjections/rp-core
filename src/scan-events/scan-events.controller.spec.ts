import { Test, TestingModule } from '@nestjs/testing';
import { ScanEventsController } from './scan-events.controller';
import { ScanEventsService } from './scan-events.service';

describe('ScanEventsController', () => {
  let controller: ScanEventsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ScanEventsController],
      providers: [ScanEventsService],
    }).compile();

    controller = module.get<ScanEventsController>(ScanEventsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
