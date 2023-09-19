import { HttpException, Injectable, Inject, HttpStatus } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import * as dayjs from 'dayjs';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Chicago');
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event, EventDocument } from './event.schema';
import { AttendeeService } from '../attendees/attendees.service';
import { constants } from '../constants';

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
    return this.eventModel.aggregate([
      {
        $addFields: {
          attendeeCount: {
            $size: '$attendees',
          },
        },
      },
      {
        $project: {
          attendees: 0,
        },
      },
    ]);
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
    const attendee = await this.attendeeService.findOne(attendeeId);
    if (!attendee) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'attendee id does not exist',
      };
    }
    let priority =
      attendee.priority_expiry != null &&
      dayjs(attendee.priority_expiry).isAfter(dayjs());

    if (attendee.events.some((e) => (e as unknown) == id)) {
      return {
        status: HttpStatus.ACCEPTED,
        message: 'attendee already registered for event',
        priority,
        prior_check_in: true,
      };
    }

    const event: EventDocument = await this.eventModel.findOne({ _id: id });
    if (!event) {
      return {
        status: HttpStatus.BAD_REQUEST,
        message: 'event id does not exist',
      };
    }

    const session = await this.connection.startSession();
    try {
      await session.withTransaction(async () => {
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
      prior_check_in: false,
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

      const dayFilteredEvents = allEvents.filter((event) => {
        const date = dayjs(event.start_time).tz('America/Chicago');
        return (
          date.isBefore(constants.end_date) &&
          date.isAfter(constants.start_date)
        );
      });

      for (const event of dayFilteredEvents) {
        let num = dayjs(event.start_time).tz('America/Chicago').day();
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
