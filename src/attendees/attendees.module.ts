import { Module } from '@nestjs/common';
import { AttendeeController } from './attendees.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Attendee, AttendeeSchema } from './attendees.schema';
import { AttendeeService } from './attendees.service';
//TODO: import EmailModule, EmailService


@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Attendee.name, schema: AttendeeSchema },
    ]),
  ],
  controllers: [AttendeeController],
  providers: [AttendeeService],
  exports: [
    MongooseModule.forFeature([
      { name: Attendee.name, schema: AttendeeSchema },
    ]),
    AttendeeService,
  ],
})
export class AttendeesModule {}
