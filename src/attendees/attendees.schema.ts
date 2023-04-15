import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, Types, model } from 'mongoose';
import { EventSchema } from 'src/events/event.schema';

export type AttendeeDocument = HydratedDocument<Event>;

const studentInfo = new MongooseSchema({
  university: {type: String, required: true},
  occupation: {type: String},
  graduation: {type: Date || null, required: true},
  major: {type: String || null, required: true},
});

@Schema()
export class Attendee {
  
  Event = model('Event', EventSchema);

  @Prop({
    required: true
  })
  name: string;

  @Prop({
    required: true,
    unique: true
  })
  email: string;

  @Prop(raw({
    studentInfo, 
    required: true
  }))
  collegeInfo: Record<string, any>

  // next two fields have a default of null in case someone is NOT a student
  @Prop({
    required: true
  })
  events: [{type: MongooseSchema.Types.ObjectId, ref: 'Event'}];

  @Prop({
    required: true
  })
  dietary_restrictions: [{types: String}];

  @Prop({
    required: true
  })
  age: number | null;

  @Prop({
    required: true
  })
  gender: string | null;

  @Prop({
    required: true
  })
  race: string | null;

  @Prop({
    required: true
  })
  ethnicity: string | null;

  @Prop({
    required: true
  })
  first_gen: boolean | null;
  
  @Prop({
    required: true
  })
  hear_about_rp: [{type: String}];

  @Prop()
  resume: string;

  @Prop()
  portfolio: string;

  @Prop()
  linkedin: string;

  @Prop()
  gpa: number;

  @Prop()
  job_interest: [{type: String}];

  @Prop()
  areas_of_interest: [{type: String}];

  @Prop()
  interest_mech_mania: boolean;

  @Prop()
  interest_puzzle_bang: boolean;

}

export const AttendeeSchema = SchemaFactory.createForClass(Attendee);
