import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EventDocument = HydratedDocument<Event>;


@Schema()
export class Attendee {
  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  email: string;

  @Prop()
  current_student: boolean;

  @Prop()
  uiuc: boolean;

  @Prop()
  university: string;

  @Prop()
  occupation: string;

  @Prop({
    required: true,
  })
  graduation: Date;

  @Prop({
    required: true,
  })
  major: string;

  @Prop({
    required: true,
  })
  num_unique_events: number;

  // concatenate all the dietary restrictions
  @Prop({
    required: true,
  })
  dietary_restrictions: string[];

  // condense allergies w/ dietary restrictions(?)/ask logistics
  @Prop({
    required: true,
  })
  allergies: string[];

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

  // Concatenate
  @Prop()
  areas_of_interest: string[];

  @Prop()
  interest_mm: boolean;

  @Prop()
  interest_pb: boolean;

}


export const EventSchema = SchemaFactory.createForClass(Event);
