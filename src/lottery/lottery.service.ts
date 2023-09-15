import { HttpException, Injectable, Inject, HttpStatus } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/mongoose';
import { Model, Connection } from 'mongoose';
import { Event, EventDocument } from '../events/event.schema';
import { AttendeeService } from '../attendees/attendees.service';

@Injectable()
export class LotteryService {
    constructor(
        @InjectModel(Event.name) private eventModel: Model<EventDocument>,
        @Inject(AttendeeService) private attendeeService: AttendeeService,
        @InjectConnection() private connection: Connection,
      ) {}

    async findAttendees(id: string) {
        try {
            const event = await this.eventModel.findById(id).populate('attendees');
            if (!event) {
                throw new HttpException('Event not found', HttpStatus.NOT_FOUND);
            }
            return event.attendees;
        } catch (error) {
            throw new HttpException('Error finding attendees for the event', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
