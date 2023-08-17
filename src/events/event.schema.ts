import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Schema as MongooseSchema, model } from 'mongoose';
import { AttendeeSchema } from '../attendees/attendees.schema';

export type EventDocument = HydratedDocument<Event>;

@Schema()
export class Event {
  Attendee = model('Attendee', AttendeeSchema);

  @Prop({
    required: true,
  })
  name: string;

  @Prop({
    required: true,
  })
  description: string;

  @Prop({
    required: true,
  })
  start_time: Date;

  @Prop({
    required: true,
  })
  end_time: Date;

  @Prop({
    required: true,
  })
  duration: Number;

  @Prop({
    required: true,
    default: [],
  })
  attendees: [{ type: MongooseSchema.Types.ObjectId; ref: 'Attendee' }];

  @Prop({
    required: true,
  })
  location: string;

  @Prop({
    required: true,
  })
  virtual: boolean;

  @Prop({
    default: false,
  })
  upgrade: boolean;

  @Prop({
    default: false,
  })
  visible: boolean;
}

export const EventSchema = SchemaFactory.createForClass(Event);
