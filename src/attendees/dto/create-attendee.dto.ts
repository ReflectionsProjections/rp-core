import { IsEmail, IsNotEmpty, isNotEmpty } from 'class-validator';
import {
  HydratedDocument,
  Schema as MongooseSchema,
  Types,
  model,
} from 'mongoose';

export class CreateAttendeeDto {
  @IsNotEmpty()
  name: string;

  @IsEmail()
  email: string;

  @IsNotEmpty()
  isCollegeStudent: string;


  isUIUCStudent: string;

  @IsNotEmpty()
  major: string;
  majorOther: string;

  @IsNotEmpty()
  collegeName: string;

  @IsNotEmpty()
  expectedGradTerm: string;

  @IsNotEmpty()
  expectedGradYear: string;
  
  //occupation: string;
  age: number | null;
  gender: string | null;
  ethnicity: string | null;
  race: [{ type: string }];
  raceOther: string;
  firstGen: string;

  @IsNotEmpty()
  food: string;

  jobTypeInterest: [{ type: string }];
  portfolioLink: string;
  mechPuzzle: [{ type: string }];
  marketing: [{ type: string }];
  marketingOther: string;
}