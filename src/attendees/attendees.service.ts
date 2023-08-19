import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as QRCode from 'qrcode';
import { Attendee, AttendeeDocument } from './attendees.schema';
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
