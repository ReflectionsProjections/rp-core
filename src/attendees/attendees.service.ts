import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectModel } from '@nestjs/mongoose';
import * as dayjs from 'dayjs';
import * as customParseFormat from 'dayjs/plugin/customParseFormat';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';
import { Model } from 'mongoose';
import * as QRCode from 'qrcode';
import { EventDocument } from '../events/event.schema';
import { Attendee, AttendeeDocument } from './attendees.schema';
import { CreateAttendeeDto } from './dto/create-attendee.dto';
import { UpdateAttendeeDto } from './dto/update-attendee.dto';
import { ConfigService } from '@nestjs/config';
dayjs.extend(customParseFormat);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.tz.setDefault('America/Chicago');

@Injectable()
export class AttendeeService {
  constructor(
    @InjectModel(Attendee.name) private attendeeModel: Model<Attendee>,
    @InjectModel(Event.name) private eventModel: Model<EventDocument>,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
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

  async findAttendeesWithResumes() {
    return this.attendeeModel.find({ has_resume: true });
  }

  async selectWinners(numWinners: number, date: string) {
    // TODO: Remove black magic
    const lotteryDate = dayjs(date, 'MM-DD-YYYY', true)
      .tz('America/Chicago')
      .add(12, 'hours');
    if (!lotteryDate.isValid()) {
      throw new BadRequestException('Date must follow the format: MM-DD-YYYY');
    }

    const events = await this.eventModel.find(
      {
        visible: true,
        upgrade: true,
      },
      {
        _id: 1,
        name: 1,
        start_time: 1,
      },
    );

    const dayFilteredEvents = events.filter((event) => {
      const eventDay = dayjs(event.start_time).tz('America/Chicago');
      return lotteryDate.isSame(eventDay, 'day');
    });

    const eventIds = dayFilteredEvents.map((e) => e._id.toString());

    const winners = await this.attendeeModel.aggregate([
      {
        $unwind: {
          path: '$events',
          preserveNullAndEmptyArrays: false,
        },
      },
      {
        $match: {
          events: {
            $in: eventIds,
          },
        },
      },
      {
        $group: {
          _id: '$_id',
          name: {
            $first: '$name',
          },
          email: {
            $first: '$email',
          },
          events: {
            $count: {},
          },
        },
      },
      {
        $addFields: {
          weight: {
            $multiply: [
              '$events',
              {
                $rand: {},
              },
            ],
          },
        },
      },
      {
        $sort: {
          weight: -1,
        },
      },
      {
        $project: {
          name: 1,
          email: 1,
        },
      },
      {
        $limit: numWinners,
      },
    ]);
    return {
      winners,
      eventsConsidered: dayFilteredEvents.map((e) => e.name),
    };
  }

  async getResumeBookRecords() {
    return await this.attendeeModel.aggregate([
      { $match: { has_resume: true } },
      {
        $addFields: {
          resume_link: {
            $concat: [
              'localhost:3000/carp/resume/permalink/',
              { $toString: '$_id' },
              `?secret=${this.configService.get('CARP_SECRET')}`,
            ],
          },
          job_interest: {
            $reduce: {
              input: '$job_interest',
              initialValue: '',
              in: {
                $concat: [
                  '$$value',
                  {
                    $cond: {
                      if: {
                        $eq: ['$$value', ''],
                      },
                      then: '',
                      else: ',',
                    },
                  },
                  '$$this',
                ],
              },
            },
          },
        },
      },
      {
        $project: {
          _id: 0,
          name: 1,
          email: 1,
          job_interest: 1,
          portfolio: 1,
          major: '$studentInfo.major',
          graduation: '$studentInfo.graduation',
          university: '$studentInfo.university',
          resume_link: 1,
        },
      },
    ]);
  }
}
