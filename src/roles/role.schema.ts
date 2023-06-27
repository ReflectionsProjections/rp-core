import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';
import { RoleLevel } from './role.enum';

export type RoleDocument = HydratedDocument<Role>;


@Schema()
export class Role {
  @Prop({
    required: true
  })
  email: string;

  @Prop({
    required: true
  })
  role: RoleLevel;
}

export const RoleSchema = SchemaFactory.createForClass(Role);
