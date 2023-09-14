import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as QRCode from 'qrcode';
import * as dayjs from 'dayjs';
import { Attendee, AttendeeDocument } from './attendees.schema';
import { EventDocument } from '../events/event.schema';
import { CreateAttendeeDto } from './dto/create-attendee.dto';
import { UpdateAttendeeDto } from './dto/update-attendee.dto';

@Injectable()
export class AttendeeService {
  constructor(
    @InjectModel(Attendee.name) private attendeeModel: Model<Attendee>,
    private readonly jwtService: JwtService,
  ) {}

  async userEmailExists(email: string): Promise<boolean> {
    const users = await this.attendeeModel.find({ email });
    return users.length > 0;
  }

  async create(createAttendeeDto: CreateAttendeeDto) {
    const university =
      createAttendeeDto.isUIUCStudent === 'yes'
        ? 'University of Illinois Urbana-Champaign'
        : createAttendeeDto.collegeName || 'N/A';

    const attendee = {
      name: createAttendeeDto.name.trim(),
      email: createAttendeeDto.email.trim(),
      //need to initialize studentInfo

      studentInfo: {
        university,
        graduation:
          createAttendeeDto.expectedGradTerm +
          ' ' +
          createAttendeeDto.expectedGradYear,
        major: createAttendeeDto.major || 'N/A',
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
      has_resume: false,
    };
    return await this.attendeeModel.create(attendee);
  }

  findAll() {
    return this.attendeeModel.find();
  }

  findOne(id: string) {
    return this.attendeeModel.findById(id);
  }

  async findAttendeeByEmail(email: string): Promise<AttendeeDocument> {
    return this.attendeeModel.findOne({ email });
  }

  async update(id: string, updateAttendeeDto: UpdateAttendeeDto) {
    const { portfolioLink, jobTypeInterest } = updateAttendeeDto;

    const updateObject: Partial<AttendeeDocument> = {};

    if (portfolioLink !== undefined) {
      updateObject.portfolio = portfolioLink;
    }

    if (jobTypeInterest !== undefined) {
      updateObject.job_interest = jobTypeInterest;
    }

    return this.attendeeModel.findByIdAndUpdate(id, updateObject, {
      new: true,
    });
  }

  async setResumeUploaded(id: string) {
    return this.attendeeModel.findByIdAndUpdate(
      id,
      { has_resume: true },
      {
        new: true,
      },
    );
  }

  remove(id: string) {
    return `This action removes a #${id} event`;
  }

  addEventAttendance(id: string, event: EventDocument) {
    return this.attendeeModel.updateOne(
      { _id: id },
      {
        $addToSet: { events: event.id },
        $set:
          event.upgrade || event.downgrade
            ? {
                priority_expiry: event.upgrade
                  ? dayjs().add(1, 'day').toDate()
                  : null,
              }
            : {},
      },
    );
  }

  async getQRPassImageDataURL(email: string): Promise<string> {
    const signed_payload = await this.jwtService.signAsync(
      { email },
      {
        expiresIn: '30d',
      },
    );
    return QRCode.toDataURL(signed_payload);
  }
}
