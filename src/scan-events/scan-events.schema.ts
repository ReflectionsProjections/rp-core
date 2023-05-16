import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ScanEventDocument = HydratedDocument<ScanEvent>;

@Schema()
export class ScanEvent {
  @Prop({
    required: true,
  })
  userID: string;
}

export const ScanEventSchema = SchemaFactory.createForClass(ScanEvent);
