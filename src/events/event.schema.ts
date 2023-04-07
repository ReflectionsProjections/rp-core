import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type EventDocument = HydratedDocument<Event>;


@Schema()
export class Event {
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
  date_time: Date;

  @Prop({
    required: true,
  })
  attendees: string[];
}


export const EventSchema = SchemaFactory.createForClass(Event);
