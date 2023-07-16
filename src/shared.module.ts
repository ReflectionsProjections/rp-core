import { Module } from '@nestjs/common';
import { AttendeeService } from 'src/attendees/attendees.service';
import { S3ModuleService } from 'src/s3-module/s3-module.service';

@Module({
  providers: [AttendeeService, S3ModuleService],
  exports: [AttendeeService, S3ModuleService],
})
export class SharedModule {}