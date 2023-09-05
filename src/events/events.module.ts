import { Module } from '@nestjs/common';
import { EventsService } from './events.service';
import { EventsController } from './events.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { Event, EventSchema } from './event.schema';
import { RolesModule } from '../roles/roles.module';
import { AttendeesModule } from '../attendees/attendees.module';
import { CacheModule } from '@nestjs/cache-manager';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
    RolesModule,
    AttendeesModule,
    CacheModule.register({
      ttl: 60000, // milliseconds
      max: 10,
    }),
  ],
  controllers: [EventsController],
  providers: [EventsService],
  exports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
  ],
})
export class EventsModule {}
