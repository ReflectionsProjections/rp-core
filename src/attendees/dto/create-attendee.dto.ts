import {
  HydratedDocument,
  Schema as MongooseSchema,
  Types,
  model,
} from 'mongoose';
import { EventSchema } from 'src/events/event.schema';

export class CreateAttendeeDto {
  name: string;
  email: string;
  collegeInfo: Record<string, any>;
  occupation: string;
  events: [{ type: MongooseSchema.Types.ObjectId; ref: 'Event' }];
  age: number;
  gender: string;
  race: [{ type: string }];
  ethnicity: string;
  first_gen: boolean;
  dietary_restrictions: [{ type: string }];
  resume: string;
  portfolio: string;
  job_interest: [{ type: string }];
  gpa: number;
  interest_mech_mania: boolean;
  interest_puzzle_bang: boolean;
  hear_about_rp: [{ type: string }];
}
