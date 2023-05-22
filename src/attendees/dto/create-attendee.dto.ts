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
  occupation: string;
  age: number | null;
  gender: string | null;
  ethnicity: string | null;
  race: [{ type: string }];
  raceOther: string;
  firstGen: string;
  food: string;
  //foodOther: string;
  jobTypeInterest: [ {type: string} ];
  portfolioLink: string;
  mechPuzzle: [ {type: string} ];
  marketing: [ {type: string} ];
  marketingOther: string;

  // events: [{ type: MongooseSchema.Types.ObjectId; ref: 'Event' }];
  // dietary_restrictions: [{ type: string}];

  // age: number | null;
  // gender: string | null;
  // race: [{ type: string}];
  // ethnicity: string | null;
  // first_gen: string | null;
  // hear_about_rp: [{ type: string }];
  
  // portfolio: string | null;
  // job_interest: [ {type: string } ];
  // interest_mech_puzzle: [ {type: string }];
  

}
