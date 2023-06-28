import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Connection, Model } from 'mongoose';
import { AttendeesModule } from '../attendees/attendees.module';
import { Attendee } from '../attendees/attendees.schema';
import { AttendeeService } from '../attendees/attendees.service';
import { EmailService } from '../email/email.service';
import { Role } from '../roles/role.schema';
import { Event } from './event.schema';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { AppModule } from '../app.module';
import { RolesService } from '../roles/roles.service';

describe('EventsController', () => {
  // TODO: Mock or Set up test database connection for testing transactions
  let controller: EventsController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
      controllers: [EventsController],
      providers: [
        EventsService,
        {
          provide: getModelToken(Event.name),
          useValue: Model,
        },
        {
          provide: getModelToken(Role.name),
          useValue: Model,
        },
        RolesService,
        {
          provide: getModelToken(Attendee.name),
          useValue: Model,
        },
        EmailService,
        AttendeeService,
      ],
    }).compile();
    controller = module.get<EventsController>(EventsController);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
