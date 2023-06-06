import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { AttendeeService } from './attendees.service';
// import { EventsService } from './events.service';
// import { CreateEventDto } from './dto/create-event.dto';
// import { UpdateEventDto } from './dto/update-event.dto';

@Controller('attendee')
export class AttendeeController {
  constructor(private readonly attendeeService: AttendeeService) {}

  // @Post()
  // create(@Body() createEventDto: CreateEventDto) {
  //   return this.eventsService.create(createEventDto);
  // }

  @Get()
  findAll() {
    return this.attendeeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendeeService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateEventDto: UpdateEventDto) {
  //   return this.eventsService.update(+id, updateEventDto);
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendeeService.remove(+id);
  }
}
