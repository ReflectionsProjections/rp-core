import { Test, TestingModule } from '@nestjs/testing';
import { AttendeeController } from './attendees.controller';
import { AttendeeService } from './attendees.service';
import { AttendeesModule } from './attendees.module';
import { getModelToken } from '@nestjs/mongoose';
import { Attendee } from './attendees.schema';
import { Model } from 'mongoose';
import { EmailService } from '../email/email.service';

describe('AttendeeService', () => {
  let controller: AttendeeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AttendeeController],
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

    controller = module.get<AttendeeController>(AttendeeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
