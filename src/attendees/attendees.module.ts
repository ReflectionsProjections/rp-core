import { Module } from '@nestjs/common';
import { AttendeeController } from './attendees.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Attendee, AttendeeSchema } from './attendees.schema';
import { AttendeeService } from './attendees.service';


@Module({
  imports: [
    MongooseModule.forFeature([{ name: Attendee.name, schema: AttendeeSchema }]),
  ],
  controllers: [AttendeeController],
  providers: [AttendeeService],
  exports: [
    MongooseModule.forFeature([{ name: Event.name, schema: AttendeeSchema }]),
  ],
})
export class AttendeesModule {}
