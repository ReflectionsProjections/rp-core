import {
  HydratedDocument,
  Schema as MongooseSchema,
  Types,
  model,
} from 'mongoose';

export class CreateAttendeeDto {

  name: string;
  email: string;
  isCollegeStudent: string;
  isUIUCStudent: string;
  major: string;
  collegeName: string;
  expectedGradYear: string;
  //occupation: string;
  age: number | null;
  gender: string | null;
  ethnicity: string | null;
  race: [{ type: string }];
  raceOther: string;
  firstGen: string;
  food: string;
  jobTypeInterest: [ {type: string} ];
  portfolioLink: string;
  mechPuzzle: [ {type: string} ];
  marketing: [ {type: string} ];
  marketingOther: string;
  
}
