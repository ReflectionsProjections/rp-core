import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import {
  HydratedDocument,
  Schema as MongooseSchema,
  Types,
  model,
} from 'mongoose';
import { EventSchema } from '../events/event.schema';
import dayjs from 'dayjs';

export type AttendeeDocument = HydratedDocument<Attendee>;

@Schema()
export class Attendee {
  Event = model('Event', EventSchema);

  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop(
    raw({
      university: { type: String, required: true },
      graduation: { type: String, default: null, required: true },
      major: { type: String, default: null, required: true },
    }),
  )
  studentInfo: {
    university: string;
    graduation: string | null;
    major: string | null;
  };

  @Prop({
    required: true,
    default: [],
  })
  events: [{ type: MongooseSchema.Types.ObjectId; ref: 'Event' }];

  @Prop({
    required: true,
  })
  dietary_restrictions: string;

  @Prop()
  age: number | null;

  @Prop()
  gender: string | null;

  @Prop()
  race: [{ type: string }] | null;

  @Prop()
  ethnicity: string | null;

  @Prop()
  first_gen: string | null;

  @Prop()
  hear_about_rp: [{ type: string }];

  @Prop()
  portfolio: string;

  @Prop()
  job_interest: [{ type: string }];

  @Prop()
  interest_mech_puzzle: [{ type: string }];

  @Prop({
    default: null,
  })
  priority_expiry: Date;

  @Prop({
    default: false,
  })
  has_resume: boolean;
}

export const AttendeeSchema = SchemaFactory.createForClass(Attendee);
