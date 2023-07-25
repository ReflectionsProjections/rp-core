import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { AppModule } from '../app.module';
import { Attendee } from '../attendees/attendees.schema';
import { AttendeeService } from '../attendees/attendees.service';
import { Event } from './event.schema';
import { EventsModule } from './events.module';
import { EventsService } from './events.service';

describe('EventsService', () => {
  // TODO set up test MongoDB connection
  let service: EventsService;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, EventsModule],
      providers: [
        EventsService,
        {
          provide: getModelToken(Event.name),
          useValue: Model,
        },
        {
          provide: getModelToken(Attendee.name),
          useValue: Model,
        },
        AttendeeService,
      ],
    }).compile();
    service = module.get<EventsService>(EventsService);
  });
  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
