import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAttendeeDto } from './dto/create-attendee.dto';
import { UpdateAttendeeDto } from './dto/update-attendee.dto';
import { Attendee, AttendeeDocument } from './attendees.schema';

@Injectable()
export class AttendeeService {
  constructor(
    @InjectModel(Attendee.name) private attendeeModel: Model<AttendeeDocument>,
  ) {}

  create(createAttendeeDto: CreateAttendeeDto) {

    const university = createAttendeeDto.isUIUCStudent === 'yes' ? 'University of Illinois Urbana-Champaign' : createAttendeeDto.collegeName;

    const attendee = {
      name: createAttendeeDto.name,
      email: createAttendeeDto.email,
      //need to initialize studentInfo
      studentInfo: {
        university,
        graduation: createAttendeeDto.expectedGradTerm + " " + createAttendeeDto.expectedGradYear,
        major: createAttendeeDto.major
      }, 
      //occupation: createAttendeeDto.occupation,
      events: [],
      dietary_restrictions: createAttendeeDto.food,
      age: createAttendeeDto.age,
      gender: createAttendeeDto.gender,
      race: [createAttendeeDto.race, createAttendeeDto.raceOther], //Not sure if this is the right syntax
      ethnicity: createAttendeeDto.ethnicity,
      first_gen: createAttendeeDto.firstGen,
      hear_about_rp: [createAttendeeDto.marketing, createAttendeeDto.marketingOther], //again, not sure if this is the right syntax
      portfolio: createAttendeeDto.portfolioLink,
      job_interest: createAttendeeDto.jobTypeInterest,
      interest_mech_puzzle: createAttendeeDto.mechPuzzle

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

  update(id: number, updateAttendeeDto: UpdateAttendeeDto) {
    return `This action updates a #${id} event`;
  }

  remove(id: number) {
    return `This action removes a #${id} event`;
  }
}
