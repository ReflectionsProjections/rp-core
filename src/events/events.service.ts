import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Injectable, Inject } from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event, EventDocument } from './event.schema';
import { AttendeeService } from '../attendees/attendees.service';

@Injectable()
export class EventsService {
  constructor(
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    @Inject(AttendeeService) private attendeeService: AttendeeService,
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
}
