import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type AttendeeDocument = HydratedDocument<Event>;


@Schema()
export class Attendee {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
    unique: true
  })
  email: string;

  @Prop()
  current_student: boolean;

  @Prop()
  university: string;

  @Prop()
  occupation: string;

  // next two fields have a default of null in case someone is NOT a student
  @Prop({
    required: true,
    default: null
  })
  graduation: Date;

  @Prop({
    required: true,
    default: null
  })
  major: string;

  @Prop({
    required: true,
  })
  num_unique_events: number;

  // concatenate all the dietary restrictions including allergies etc
  @Prop({
    required: true,
  })
  dietary_restrictions: string[];

  @Prop({
    required: true,
  })
  age: number;

  @Prop({
    required: true,
  })
  gender: string;

  @Prop({
    required: true,
  })
  race: string;

  @Prop({
    required: true, 
  })
  ethnicity: string;

  // Require first generation?
  @Prop()
  first_gen: boolean;
  
  @Prop({
    required: true,
  })
  hear_about_rp: string;

  // Link to Resume
  @Prop()
  resume: string;

  @Prop()
  portfolio: string;

  @Prop()
  linkedin: string;

  // Specify type of number
  @Prop()
  gpa: number;

  @Prop()
  internship: boolean;

  @Prop()
  full_time: boolean;

  @Prop()
  areas_of_interest: string[];

  @Prop()
  interest_mech_mania: boolean;

  @Prop()
  interest_puzzle_bang: boolean;

}


export const AttendeeSchema = SchemaFactory.createForClass(Event);
