import { Prop, Schema, SchemaFactory, raw } from '@nestjs/mongoose';
import {
  HydratedDocument,
  Schema as MongooseSchema,
  Types,
  model,
} from 'mongoose';
import { EventSchema } from 'src/events/event.schema';

export type AttendeeDocument = HydratedDocument<Event>;
 
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
      graduation: { type: Date, default: null, required: true },
      major: { type: String, default: null, required: true },
    }),
  )

  studentInfo: {
    university: string;
    graduation: Date | null;
    major: string | null;
  };

  // @Prop()
  // occupation: string;

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

  @Prop({
    required: true,
  })
  hear_about_rp: [{ type: string }];

  @Prop()
  portfolio: string;

  @Prop()
  job_interest: [{ type: string }];

  @Prop()
  interest_mech_puzzle: [{ type: string }];
}

export const AttendeeSchema = SchemaFactory.createForClass(Attendee);
