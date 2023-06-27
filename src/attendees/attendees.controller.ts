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
import { CreateAttendeeDto } from './dto/create-attendee.dto';
import { UpdateAttendeeDto } from './dto/update-attendee.dto';

@Controller('attendee')
export class AttendeeController {
  constructor(private readonly attendeesService: AttendeeService) {}

  @Post()
  create(@Body() createAttendeeDto: CreateAttendeeDto) {
    return this.attendeesService.create(createAttendeeDto);
  }

  @Get()
  findAll() {
    return this.attendeesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendeeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAttendeeDto: UpdateAttendeeDto) {
    return this.attendeesService.update(+id, updateAttendeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendeeService.remove(id);
  }
}
