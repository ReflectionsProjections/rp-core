import { expect, jest } from '@jest/globals';
import { createMock } from '@golevelup/ts-jest';
import {
  BadRequestException,
  ExecutionContext,
  HttpStatus,
  NotFoundException,
} from '@nestjs/common';
import { JwtModule, JwtService, JwtVerifyOptions } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AttendeeService } from '../attendees/attendees.service';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../roles/roles.guard';
import { EventsController } from './events.controller';
import { EventsService } from './events.service';
import { ConfigModule } from '@nestjs/config';
import { JsonWebTokenError } from 'node-jsonwebtoken';
import mongoose from 'mongoose';
import { Attendee, AttendeeDocument } from '../attendees/attendees.schema';

describe('EventsController', () => {
  let controller: EventsController;
  let attendeeService: AttendeeService;
  let eventsService: EventsService;
  let jwtService: JwtService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot(),
        JwtModule.register({
          secret: process.env.JWT_SECRET,
          signOptions: { expiresIn: '7d' },
        }),
      ],
      controllers: [EventsController],
      providers: [
        {
          provide: EventsService,
          useValue: {
            registerAttendance: jest.fn((eventId, attendeeId) => {}),
          },
        },
        {
          provide: AttendeeService,
          useValue: {
            findAttendeeByEmail: jest.fn((email: string) => null),
          },
        },
        JwtService,
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const request: Request = context.switchToHttp().getRequest();
          request['user'] = { email: 'test@rp.org' };
          return true;
        },
      })
      .overrideGuard(RolesGuard)
      .useValue({
        canActivate: (_context: ExecutionContext) => true,
      })
      .compile();
    controller = module.get<EventsController>(EventsController);
    attendeeService = module.get<AttendeeService>(AttendeeService);
    eventsService = module.get<EventsService>(EventsService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('registerAttendeeWithEmail throws exception if user with email is not found', async () => {
    const findAttendeeByEmailSpy = jest
      .spyOn(attendeeService, 'findAttendeeByEmail')
      .mockResolvedValueOnce(null);
    const email = 'test-unknown@rp.org';
    const eventId = new mongoose.Types.ObjectId().toString();

    await expect(
      controller.registerAttendeeWithEmail(eventId, { email }),
    ).rejects.toThrow(NotFoundException);
    expect(findAttendeeByEmailSpy).toBeCalledWith(email);
  });

  it('registerAttendeeWithEmail calls registerAttendance if user is found', async () => {
    const email = 'test@rp.org';
    const attendeeId = new mongoose.Types.ObjectId();
    const attendeeMock = createMock<AttendeeDocument>({
      _id: attendeeId,
      email,
    });

    const findAttendeeByEmailSpy = jest
      .spyOn(attendeeService, 'findAttendeeByEmail')
      .mockResolvedValueOnce(attendeeMock);

    const successResponse = {
      status: HttpStatus.ACCEPTED,
      message: 'attendee registered for event',
    };

    const registerAttendanceSpy = jest
      .spyOn(eventsService, 'registerAttendance')
      .mockResolvedValueOnce(successResponse);

    const eventId = new mongoose.Types.ObjectId().toString();

    await expect(
      controller.registerAttendeeWithEmail(eventId, { email }),
    ).resolves.toEqual(successResponse);

    expect(registerAttendanceSpy).toBeCalledWith(
      eventId,
      attendeeId.toString(),
    );
    expect(findAttendeeByEmailSpy).toBeCalledWith(email);
  });

  it('registerAttendeeWithQR throws exception if jwt token cannot be verified', async () => {
    const token = 'definitely not a valid jwt token';

    await expect(
      controller.registerAttendeeWithQR('64c6d679d29207cbff121edf', { token }),
    ).rejects.toThrow(BadRequestException);
  });

  it('registerAttendeeWithQR throws exception if user with email is not found', async () => {
    const findAttendeeByEmailSpy = jest
      .spyOn(attendeeService, 'findAttendeeByEmail')
      .mockResolvedValueOnce(null);
    const email = 'test-unknown@rp.org';
    const token = jwtService.sign({ email });
    const eventId = new mongoose.Types.ObjectId().toString();

    await expect(
      controller.registerAttendeeWithQR(eventId, { token }),
    ).rejects.toThrow(NotFoundException);
    expect(findAttendeeByEmailSpy).toBeCalledWith(email);
  });

  it('registerAttendeeWithQR calls registerAttendance if user is found', async () => {
    const email = 'test@rp.org';
    const attendeeId = new mongoose.Types.ObjectId();
    const attendeeMock = createMock<AttendeeDocument>({
      _id: attendeeId,
      email,
    });

    const findAttendeeByEmailSpy = jest
      .spyOn(attendeeService, 'findAttendeeByEmail')
      .mockResolvedValueOnce(attendeeMock);

    const successResponse = {
      status: HttpStatus.ACCEPTED,
      message: 'attendee registered for event',
    };

    const registerAttendanceSpy = jest
      .spyOn(eventsService, 'registerAttendance')
      .mockResolvedValueOnce(successResponse);

    const token = jwtService.sign({ email });
    const eventId = new mongoose.Types.ObjectId().toString();

    await expect(
      controller.registerAttendeeWithQR(eventId, { token }),
    ).resolves.toEqual(successResponse);

    expect(registerAttendanceSpy).toBeCalledWith(
      eventId,
      attendeeId.toString(),
    );
    expect(findAttendeeByEmailSpy).toBeCalledWith(email);
  });
});
