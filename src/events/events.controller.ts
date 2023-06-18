import { Controller, Get, Post, Body, Patch, Param, Delete, HttpStatus, HttpException } from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { RegisterAttendeeDto } from './dto/register-attendee.dto';
import { MongoIdPipe } from '../mongo-id/mongo-id.pipe';

@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Post()
  create(@Body() createEventDto: CreateEventDto) {
    return this.eventsService.create(createEventDto);
  }

  @Get()
  findAll() {
    return this.eventsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', MongoIdPipe) id: string) {
    return this.eventsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id', MongoIdPipe) id: string, @Body() updateEventDto: UpdateEventDto) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id', MongoIdPipe) id: string) {
    return this.eventsService.remove(id);
  }

  @Post(':id/attendee')
  async registerAttendee(@Param('id', MongoIdPipe) id: string, @Body() registerAttendeeDto: RegisterAttendeeDto) {
    const { status, message } = await this.eventsService.register(id, registerAttendeeDto.id);

    if (status != HttpStatus.ACCEPTED) {
      throw new HttpException(message, status);
    }

    return { status, message };
  }
}
