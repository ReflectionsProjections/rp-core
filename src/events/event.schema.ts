import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';

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
  start_time: Date;

  @Prop({
    required: true,
  })
  end_time: Date;

  @Prop({
    required: true,
  })
  attendees: Types.ObjectId[];
}


export const EventSchema = SchemaFactory.createForClass(Event);
