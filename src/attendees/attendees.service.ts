import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
// import { CreateEventDto } from './dto/create-event.dto';
// import { UpdateEventDto } from './dto/update-event.dto';
import { Attendee, AttendeeDocument } from './attendees.schema';

@Injectable()
export class AttendeeService {
  constructor(
    @InjectModel(Attendee.name) private attendeeModel: Model<AttendeeDocument>,
  ) {}

  // create(createEventDto: CreateEventDto) {
  //   const newEvent = new this.eventModel(createEventDto);
  //   return newEvent.save();
  // }

  findAll() {
    return this.attendeeModel.find();
  }

  findOne(id: string) {
    return this.attendeeModel.find({ _id: id });
  }

  // update(id: number, updateEventDto: UpdateEventDto) {
  //   return `This action updates a #${id} event`;
  // }

  remove(id: string) {
    return `This action removes a #${id} event`;
  }

  addEvent(id: string, eventId: string) {
    return this.attendeeModel.updateOne({ _id: id }, { $push: { events: eventId } });
  }
}
