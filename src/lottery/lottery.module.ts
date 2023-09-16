import { Module } from '@nestjs/common';
import { LotteryController } from './lottery.controller';
import { LotteryService } from './lottery.service';
import { Event, EventSchema } from '../events/event.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { EventsService } from '../events/events.service';



@Module({
  imports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
  ],
  controllers: [LotteryController],
  providers: [LotteryService, Event],
  exports: [
    MongooseModule.forFeature([{ name: Event.name, schema: EventSchema }]),
  ],
})
export class LotteryModule {}
