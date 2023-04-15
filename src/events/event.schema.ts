import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
<<<<<<< HEAD
import { HydratedDocument, Schema as MongooseSchema, model} from 'mongoose';
import { AttendeeSchema } from 'src/attendees/attendees.schema';
=======
import { HydratedDocument, Types } from 'mongoose';
>>>>>>> 407d6ac6c3468c24381461bf926a537356a319b0

export type EventDocument = HydratedDocument<Event>;


@Schema()
export class Event {

  Attendee = model('Attendee', AttendeeSchema);

  @Prop({
    required: true
  })
  name: string;

  @Prop({
    required: true
  })
  description: string;

  @Prop({
    required: true
  })
  start_time: Date;

  @Prop({
    required: true
  })
<<<<<<< HEAD
  duration: Number;

  @Prop({
    required: true
  })
  attendees: [{type: MongooseSchema.Types.ObjectId, ref: 'Attendee'}];

  @Prop({
    required: true
  })
  location: string;

  @Prop({
    required: true
  })
  virtual: boolean;
=======
  end_time: Date;

  @Prop({
    required: true,
  })
  attendees: Types.ObjectId[];
>>>>>>> 407d6ac6c3468c24381461bf926a537356a319b0
}

export const EventSchema = SchemaFactory.createForClass(Event);
