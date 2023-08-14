import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { AppModule } from '../app.module';
import { Attendee } from '../attendees/attendees.schema';
import { AttendeeService } from '../attendees/attendees.service';
import { EmailService } from '../email/email.service';
import { Role } from '../roles/role.schema';
import { RolesService } from '../roles/roles.service';
import { WalletService } from '../wallet/wallet.service';
import { Event } from './event.schema';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { EmailModule } from '../email/email.module';
import { HttpModule } from '@nestjs/axios';

describe('EventsController', () => {
  // TODO: Mock or Set up test database connection for testing transactions
  let controller: EventsController;
  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, HttpModule],
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
        {
          provide: WalletService,
          useValue: {
            get: jest.fn((key: string) => {}),
          },
        },
      ],
    }).compile();
    controller = module.get<EventsController>(EventsController);
  });
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
