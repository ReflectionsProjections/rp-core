import { HttpException, Injectable, Inject, HttpStatus } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import * as dayjs from 'dayjs';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event, EventDocument } from './event.schema';
import { AttendeeService } from '../attendees/attendees.service';
import { constants } from '../constants';

import * as dayjs from 'dayjs';
// dayjs.extend('dayjs/plugin/IsBetween')

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
    let priority;

    try {
      await session.withTransaction(async () => {
        const event: EventDocument = await this.eventModel.findOne({ _id: id });
        if (!event)
          return {
            status: HttpStatus.BAD_REQUEST,
            message: 'event id does not exist',
          };
        const attendee = await this.attendeeService.findOne(attendeeId);
        if (!attendee)
          return {
            status: HttpStatus.BAD_REQUEST,
            message: 'attendee id does not exist',
          };
        priority =
          attendee.priority_expiry != null &&
          !dayjs(attendee.priority_expiry).isBefore(dayjs());
        await this.addAttendee(id, attendeeId).session(session);
        await this.attendeeService
          .addEventAttendance(attendeeId, event)
          .session(session);
      });
    } finally {
      session.endSession();
    }

    return {
      status: HttpStatus.ACCEPTED,
      message: 'attendee registered for event',
      priority,
    };
  }

  async schedule() {
    try {
      // const all_events = await this.eventModel.find();
      const allEvents = await this.eventModel.aggregate([
        {
          $match: {
            visible: true,
          },
        },
        {
          $project: {
            attendees: 0,
          },
        },
        {
          $sort: {
            start_time: 1,
          },
        },
      ]);
      let eventsByDay = [[], [], [], [], [], [], [], []];

      console.log(allEvents);
      const dayFilteredEvents = allEvents.filter(
        (event) =>
          dayjs(event.start_time).isBefore(constants.end_date) &&
          dayjs(event.start_time).isAfter(constants.start_date),
      );

      console.log(dayFilteredEvents);

      for (const event of dayFilteredEvents) {
        let num = event.start_time.getDay();
        eventsByDay[num].push(event);
      }

      return {
        monday: eventsByDay[1],
        tuesday: eventsByDay[2],
        wednesday: eventsByDay[3],
        thursday: eventsByDay[4],
        friday: eventsByDay[5],
        saturday: eventsByDay[6],
        sunday: eventsByDay[0],
      };
    } catch (error) {
      console.error(error);
    }
  }
}
