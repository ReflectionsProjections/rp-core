import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import {
  HydratedDocument,
  Schema as MongooseSchema,
  Types,
  model,
} from 'mongoose';
import { EventSchema } from 'src/events/event.schema';

export type AttendeeDocument = HydratedDocument<Event>;

const studentInfo = new MongooseSchema({
  university: { type: String, required: true },
  graduation: { type: Date || null, required: true },
  major: { type: String || null, required: true },
});

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
      studentInfo,
    }),
  )
  collegeInfo: Record<string, any> | null;

  @Prop({
    required: true,
    default: [],
  })
  events: [{ type: MongooseSchema.Types.ObjectId; ref: 'Event' }];

  @Prop({
    required: true,
  })
  dietary_restrictions: [{ types: String }];

  @Prop({
    required: true,
  })
  age: number | null;

  @Prop({
    required: true,
  })
  gender: string | null;

  @Prop({
    required: true,
  })
  race: string | null;

  @Prop({
    required: true,
  })
  ethnicity: string | null;

  @Prop({
    required: true,
  })
  first_gen: boolean | null;

  @Prop({
    required: true,
  })
  hear_about_rp: [{ type: String }];

  @Prop()
  resume: string;

  @Prop()
  portfolio: string;

  @Prop()
  linkedin: string;

  @Prop()
  gpa: number;

  @Prop()
  occupation: String;

  @Prop()
  job_interest: [{ type: String }];

  @Prop()
  interest_mech_mania: boolean;

  @Prop()
  interest_puzzle_bang: boolean;
}

export const AttendeeSchema = SchemaFactory.createForClass(Attendee);
