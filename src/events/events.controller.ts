import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  HttpException,
  Put,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { RegisterAttendeeDto } from './dto/register-attendee.dto';
import { MongoIdPipe } from '../mongo-id/mongo-id.pipe';
import { RoleLevel } from '../roles/roles.enum';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { AuthGuard } from '../auth/auth.guard';

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
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleLevel.Admin)
  update(
    @Param('id', MongoIdPipe) id: string,
    @Body() updateEventDto: UpdateEventDto,
  ) {
    return this.eventsService.update(id, updateEventDto);
  }

  @Delete(':id')
  remove(@Param('id', MongoIdPipe) id: string) {
    return this.eventsService.remove(id);
  }

  @Put(':id/attendee')
  async registerAttendee(
    @Param('id', MongoIdPipe) id: string,
    @Body() registerAttendeeDto: RegisterAttendeeDto,
  ) {
    const { status, message } = await this.eventsService.registerAttendance(
      id,
      registerAttendeeDto.id,
    );

    if (status != HttpStatus.ACCEPTED) {
      throw new HttpException(message, status);
    }

    return { status, message };
  }
}
