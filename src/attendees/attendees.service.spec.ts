import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { EmailService } from '../email/email.service';
import { Attendee, AttendeeDocument } from './attendees.schema';
import { AttendeeService } from './attendees.service';
import { CreateAttendeeDto } from './dto/create-attendee.dto';

describe('AttendeeService', () => {
  let mockAttendeeModel: Model<AttendeeDocument>;
  let mockService: AttendeeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AttendeeService,
        {
          provide: getModelToken(Attendee.name),
          useValue: Model,
        },
        {
          provide: EmailService,
          useValue: {
            get: jest.fn((key: string) => {}),
          },
        },
      ],
    }).compile();

    mockAttendeeModel = module.get<Model<AttendeeDocument>>(
      getModelToken(Attendee.name),
    );
    mockService = module.get<AttendeeService>(AttendeeService);
  });

  it('should be defined', () => {
    expect(mockService).toBeDefined();
  });

  it('findOne should return an attendee object', async () => {
    // arrange
    const attendee = new Attendee();
    const attendeeId = '12345';
    const spy = jest
      .spyOn(mockAttendeeModel, 'findById')
      .mockResolvedValue(attendee as AttendeeDocument);
    const result = await mockService.findOne(attendeeId);
    expect(spy).toBeCalled();
    expect(result).toBe(attendee);
  });

  it('create populates fields correctly', async () => {
    // arrange
    const createAttendeeDto: CreateAttendeeDto = {
      name: 'testName',
      email: 'testEmail',
      isCollegeStudent: 'testIsCollegeStudent',
      isUIUCStudent: 'testIsUIUCStudent',
      major: 'testMajor',
      majorOther: 'testMajorOther',
      collegeName: 'testCollegeName',
      expectedGradTerm: 'testExpectedGradTerm',
      expectedGradYear: 'testExpectedGradYear',
      age: 12,
      gender: 'male',
      ethnicity: null,
      race: [{ type: 'hispanic' }],
      raceOther: 'testRaceOther',
      firstGen: 'testFirstGen',
      food: 'testFood',
      jobTypeInterest: [{ type: 'fix' }],
      portfolioLink: 'testPortfolioLink',
      mechPuzzle: [{ type: 'fix' }],
      marketing: [{ type: 'fix' }],
      marketingOther: 'testMarketingOther',
    };

    const expectedAttendee = {
      name: createAttendeeDto.name,
      email: createAttendeeDto.email,
      studentInfo: {
        university: createAttendeeDto.collegeName,
        graduation:
          createAttendeeDto.expectedGradTerm +
          ' ' +
          createAttendeeDto.expectedGradYear,
        major: createAttendeeDto.major,
      },
      events: [],
      dietary_restrictions: createAttendeeDto.food,
      age: createAttendeeDto.age,
      gender: createAttendeeDto.gender,
      race: [createAttendeeDto.race, createAttendeeDto.raceOther],
      ethnicity: createAttendeeDto.ethnicity,
      first_gen: createAttendeeDto.firstGen,
      hear_about_rp: [
        createAttendeeDto.marketing,
        createAttendeeDto.marketingOther,
      ],
      portfolio: createAttendeeDto.portfolioLink,
      job_interest: createAttendeeDto.jobTypeInterest,
      interest_mech_puzzle: createAttendeeDto.mechPuzzle,
    };
    const spy = jest
      .spyOn(mockAttendeeModel, 'create')
      .mockResolvedValue(expectedAttendee as any); // Note: Don't use any when we fix this test for the updated schema
    const result = await mockService.create(createAttendeeDto);
    expect(result).toBe(expectedAttendee);
  });
});
