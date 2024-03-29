import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';
import { Attendee } from '../attendees/attendees.schema';

@Schema()
export class Verification {
  @Prop({
    required: false,
    type: MongooseSchema.Types.ObjectId,
    ref: 'Attendee',
  })
  user: Attendee;

  @Prop({
    required: true,
    unique: true,
  })
  email: string;

  @Prop({
    required: true,
  })
  // An ISO8601 string
  expiresAt: string;

  @Prop({
    required: true,
  })
  // An ISO8601 string
  createdAt: string;

  @Prop({
    required: true,
  })
  remainingAttempts: number;

  @Prop({
    required: true,
  })
  passcodeHash: string;

  @Prop({
    required: true,
  })
  emailsSent: number;
}

export const VerificationSchema = SchemaFactory.createForClass(Verification);
