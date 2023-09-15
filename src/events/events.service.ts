import { HttpException, Injectable, Inject, HttpStatus } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event, EventDocument } from './event.schema';
import { AttendeeService } from '../attendees/attendees.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @Inject(AttendeeService) private attendeeService: AttendeeService,
    @InjectConnection() private connection: Connection,
  ) {}

  create(createEventDto: CreateEventDto) {
    const newEvent = new this.eventModel(createEventDto);
    return newEvent.save();
  }

  findAll() {
    return this.eventModel.find();
  }

  findOne(id: string) {
    return this.eventModel.findOne({ _id: id });
  }

  update(id: string, updateEventDto: UpdateEventDto) {
    return this.eventModel.updateOne({ _id: id }, updateEventDto);
  }

  remove(id: string) {
    return this.eventModel.deleteOne({ _id: id });
  }

  addAttendee(id: string, attendeeId: string) {
    return this.eventModel.updateOne(
      { _id: id },
      { $addToSet: { attendees: attendeeId } },
    );
  }


  async registerAttendance(id: string, attendeeId: string) {
    const session = await this.connection.startSession();

    try {
      await session.withTransaction(async () => {
        if (!(await this.eventModel.findOne({ _id: id })))
          return {
            status: HttpStatus.BAD_REQUEST,
            message: 'event id does not exist',
          };
        if (!(await this.attendeeService.findOne(attendeeId)))
          return {
            status: HttpStatus.BAD_REQUEST,
            message: 'attendee id does not exist',
          };
        await this.addAttendee(id, attendeeId).session(session);
        await this.attendeeService
          .addEventAttendance(attendeeId, id)
          .session(session);
      });
    } finally {
      session.endSession();
    }

    return {
      status: HttpStatus.ACCEPTED,
      message: 'attendee registered for event',
    };
  }
}
