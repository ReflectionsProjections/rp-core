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
  user: { type: MongooseSchema.Types.ObjectId; ref: 'Attendee' };

  @Prop({
    required: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  // An ISO8601 string
  expiresAt: string;
}

export const AttendeeSchema = SchemaFactory.createForClass(Attendee);
