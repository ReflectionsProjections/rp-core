import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAttendeeDto } from './dto/create-attendee.dto';
// import { UpdateEventDto } from './dto/update-event.dto';
import { Attendee, AttendeeDocument } from './attendees.schema';

@Injectable()
export class AttendeeService {
  constructor(
    @InjectModel(Attendee.name) private attendeeModel: Model<AttendeeDocument>,
  ) {}

  create(createEventDto: CreateAttendeeDto) {
    const attendee = {
      name: createEventDto.name,

      email: 'sdf',

      collegeInfo: null,

      events: [],

      dietary_restrictions: [],

      age: 244,

      gender: 'sad',

      race: 'afsa',

      ethnicity: false,

      first_gen: false,
    };
    const newAttendee = new this.attendeeModel(attendee);
    return newAttendee.save();
  }

  findAll() {
    return this.attendeeModel.find();
  }

  findOne(id: number) {
    return `This action returns a #${id} event`;
  }

  // update(id: number, updateEventDto: UpdateEventDto) {
  //   return `This action updates a #${id} event`;
  // }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
