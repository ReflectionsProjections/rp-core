import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ScanEventsService } from './scan-events.service';
import { ScanEventsController } from './scan-events.controller';
import { ScanEvent, ScanEventSchema } from './scan-events.schema';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ScanEvent.name, schema: ScanEventSchema },
    ]),
  ],
  controllers: [ScanEventsController],
  providers: [ScanEventsService],
  exports: [
    MongooseModule.forFeature([
      { name: ScanEvent.name, schema: ScanEventSchema },
    ]),
  ],
})
export class ScanEventsModule {}
