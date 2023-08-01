import { ArrayMaxSize, IsArray, IsEmail, IsIn, IsNotEmpty, IsNumberString, IsOptional, IsPositive, IsString, IsUrl, MaxLength, isNotEmpty } from 'class-validator';

import {
  HydratedDocument,
  Schema as MongooseSchema,
  Types,
  model,
} from 'mongoose';

export class CreateAttendeeDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  name: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(100)
  email: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(["yes", "no"])
  isCollegeStudent: string;

  @IsOptional() //Can change to @IsNotEmpty() maybe?
  @IsString()
  @IsIn(["yes", "no"])
  isUIUCStudent: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(50)
  major: string;

  @IsOptional()
  @IsString()
  @MaxLength(50)
  majorOther: string;

  @IsNotEmpty()
  @MaxLength(100)
  collegeName: string;

  @IsNotEmpty()
  @IsString()
  @IsIn(["Fall", "Spring", "Summer"])
  expectedGradTerm: string;

  @IsNotEmpty()
  @IsNumberString()
  expectedGradYear: string;
  
  @IsOptional()
  @IsPositive()
  age: number | null;

  @IsOptional()
  @MaxLength(30)
  gender: string | null;

  @IsOptional()
  @MaxLength(30)
  ethnicity: string | null;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(7)
  race: [{ type: string }];

  @IsOptional()
  @MaxLength(30)
  raceOther: string;

  @IsOptional()
  @IsString()
  @IsIn(["yes", "no", "preferNotToSay"])
  firstGen: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(30)
  food: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(3)
  @MaxLength(30, {
    each: true,
  })
  jobTypeInterest: [{ type: string }];

  @IsOptional()
  @IsUrl()
  @MaxLength(200)
  portfolioLink: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(2)
  @MaxLength(30, {
    each: true,
  })
  mechPuzzle: [{ type: string }];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @MaxLength(30, {
    each: true,
  })
  marketing: [{ type: string }];

  @IsOptional()
  @IsString()
  @MaxLength(30)
  marketingOther: string;
}