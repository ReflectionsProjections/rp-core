import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ScanEventDocument = HydratedDocument<ScanEvent>;

@Schema()
export class ScanEvent {
  @Prop({
    required: true,
  })
  userID: string;
  @Prop({
    required: true,
  })
  eventID: string;
  @Prop({
    required: true,
  })
  timeCode: number;
}

export const ScanEventSchema = SchemaFactory.createForClass(ScanEvent);
