import { Test, TestingModule } from '@nestjs/testing';
import { AttendeeController } from './attendees.controller';
import { EventsService } from './attendees.service';

describe('EventsController', () => {
  let controller: AttendeeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttendeeController],
      providers: [EventsService],
    }).compile();

    controller = module.get<AttendeeController>(AttendeeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
