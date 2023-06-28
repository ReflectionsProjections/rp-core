import { Test, TestingModule } from '@nestjs/testing';
import { AttendeeService } from './attendees.service';
import { AttendeesModule } from './attendees.module';
import { EventsModule } from '../events/events.module';
import { AuthModule } from '../auth/auth.module';
import { AuthService } from '../auth/auth.service';
import { EmailService } from '../email/email.service';
import { Attendee } from './attendees.schema';
import { Model } from 'mongoose';
import { getModelToken } from '@nestjs/mongoose';

describe('AttendeeService', () => {
  let service: AttendeeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttendeeService,
        {
          provide: getModelToken(Attendee.name),
          useValue: Model,
        },
        {
          provide: EmailService,
          useValue: {
            get: jest.fn((key: string) => {}),
          },
        },
      ],
    }).compile();

    service = module.get<AttendeeService>(AttendeeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
