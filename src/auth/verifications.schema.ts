import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Schema as MongooseSchema } from 'mongoose';

@Schema()
export class Verification {
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

  @Prop({
    required: true,
  })
  passcodeHash: string;
}

export const VerificationSchema = SchemaFactory.createForClass(Verification);
