import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from './event.schema';
import { AttendeesModule } from '../attendees/attendees.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    AttendeesModule 
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
  ],
})
export class EventsModule {}
