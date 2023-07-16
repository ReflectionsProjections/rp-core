import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CreateAttendeeDto } from './dto/create-attendee.dto';
import { UpdateAttendeeDto } from './dto/update-attendee.dto';
import { Attendee } from './attendees.schema';

@Injectable()
export class AttendeeService {
  constructor(
    @InjectModel(Attendee.name) private attendeeModel: Model<Attendee>,
  ) {}

  async userEmailExists(email: string): Promise<boolean> {
    const users = await this.attendeeModel.find({ email });
    return users.length > 0;
  }

  create(createAttendeeDto: CreateAttendeeDto) {
    const university =
      createAttendeeDto.isUIUCStudent === 'yes'
        ? 'University of Illinois Urbana-Champaign'
        : createAttendeeDto.collegeName;

    const attendee = {
      name: createAttendeeDto.name,
      email: createAttendeeDto.email,
      //need to initialize studentInfo
      studentInfo: {
        university,
        graduation:
          createAttendeeDto.expectedGradTerm +
          ' ' +
          createAttendeeDto.expectedGradYear,
        major: createAttendeeDto.major,
      },
      //occupation: createAttendeeDto.occupation,
      events: [],
      dietary_restrictions: createAttendeeDto.food,
      age: createAttendeeDto.age,
      gender: createAttendeeDto.gender,
      race: [createAttendeeDto.race, createAttendeeDto.raceOther], //Not sure if this is the right syntax
      ethnicity: createAttendeeDto.ethnicity,
      first_gen: createAttendeeDto.firstGen,
      hear_about_rp: [
        createAttendeeDto.marketing,
        createAttendeeDto.marketingOther,
      ], //again, not sure if this is the right syntax
      portfolio: createAttendeeDto.portfolioLink,
      job_interest: createAttendeeDto.jobTypeInterest,
      interest_mech_puzzle: createAttendeeDto.mechPuzzle,
    };
    const newAttendee = new this.attendeeModel(attendee);
    return newAttendee.save()
    .then((createdAttendee) => {
      console.log(createdAttendee._id); // Print the ID to the console
      return createdAttendee;
    });
  }

  findAll() {
    return this.attendeeModel.find();
  }

  findOne(id: string) {
    return this.attendeeModel.find({ _id: id });
  }

  update(id: number, updateAttendeeDto: UpdateAttendeeDto) {
    return `This action updates a #${id} event`;
  }

  remove(id: string) {
    return `This action removes a #${id} event`;
  }

  addEventAttendance(id: string, eventId: string) {
    return this.attendeeModel.updateOne(
      { _id: id },
      { $addToSet: { events: eventId } },
    );
  }
}