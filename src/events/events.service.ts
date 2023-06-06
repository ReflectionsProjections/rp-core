import { Injectable, Inject } from '@nestjs/common';
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
    return this.eventModel.updateOne({ _id: id }, { $push: { attendees: attendeeId } });
  }

  async register(id: string, attendeeId: string) {
    const session = await this.connection.startSession();

    try {
      await session.withTransaction(async () => {
        await this.addAttendee(id, attendeeId).session(session);
        await this.attendeeService.addEvent(attendeeId, id).session(session);
      });
    } finally {
      session.endSession();
    }
  }
}
