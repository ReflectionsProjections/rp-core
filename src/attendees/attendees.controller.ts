import {
  Controller,
  Get,
  Body,
  Patch,
  Post,
  Param,
  Delete,
  NotFoundException,
} from '@nestjs/common';
import { AttendeeService } from './attendees.service';
// import { EventsService } from './events.service';
import { CreateAttendeeDto } from './dto/create-attendee.dto';
import { UpdateAttendeeDto } from './dto/update-attendee.dto';

@Controller('attendee')
export class AttendeeController {
  constructor(private readonly attendeeService: AttendeeService) {}

  /**
   * This function checks if a user with a given email exists.
   * Throws NotFoundException if they do not.
   *
   * @param {string} email - Represents the email address of a user
   */
  @Get('/email/:email')
  async checkUserExists(@Param('email') email: string) {
    const userExists = await this.attendeeService.userEmailExists(email);
    if (!userExists) {
      throw new NotFoundException('User with that email does not exist.');
    }
  }

  @Post()
  create(@Body() createAttendeeDto: CreateAttendeeDto) {
    return this.attendeeService.create(createAttendeeDto);
  }

  @Get()
  findAll() {
    return this.attendeeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendeeService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAttendeeDto: UpdateAttendeeDto,
  ) {
    return this.attendeeService.update(+id, updateAttendeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendeeService.remove(id);
  }
}
