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
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { EventsService } from './events.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import {
  RegisterAttendeeDto,
  RegisterAttendeeEmailDto,
  RegisterAttendeeQRDto,
} from './dto/register-attendee.dto';
import { MongoIdPipe } from '../mongo-id/mongo-id.pipe';
import { RoleLevel } from '../roles/roles.enum';
import { Roles } from '../roles/roles.decorator';
import { RolesGuard } from '../roles/roles.guard';
import { AuthGuard } from '../auth/auth.guard';
import { AttendeeService } from '../attendees/attendees.service';
import { JwtService } from '@nestjs/jwt';

@Controller('events')
export class EventsController {
  constructor(
    private readonly eventsService: EventsService,
    private readonly attendeeService: AttendeeService,
    private readonly jwtService: JwtService,
  ) {}

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleLevel.Admin)
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
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleLevel.Admin)
  remove(@Param('id', MongoIdPipe) id: string) {
    return this.eventsService.remove(id);
  }

  @Put(':eventId/attendee')
  async registerAttendeeWithId(
    @Param('eventId', MongoIdPipe) eventId: string,
    @Body() body: RegisterAttendeeDto,
  ) {
    const { status, message, priority } =
      await this.eventsService.registerAttendance(eventId, body.id);

    if (status != HttpStatus.ACCEPTED) {
      throw new HttpException(message, status);
    }

    return { status, message, priority };
  }

  @Put(':eventId/attendee/email')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleLevel.Admin)
  async registerAttendeeWithEmail(
    @Param('eventId', MongoIdPipe) eventId: string,
    @Body() body: RegisterAttendeeEmailDto,
  ) {
    const attendee = await this.attendeeService.findAttendeeByEmail(body.email);
    if (!attendee) {
      throw new NotFoundException(
        `Could not find an attendee with email ${body.email}`,
      );
    }

    const { status, message, priority } =
      await this.eventsService.registerAttendance(
        eventId,
        attendee._id.toString(),
      );

    if (status != HttpStatus.ACCEPTED) {
      throw new HttpException(message, status);
    }

    return { status, message, priority };
  }

  @Put(':eventId/attendance/qr')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleLevel.Admin)
  async registerAttendeeWithQR(
    @Param('eventId', MongoIdPipe) eventId: string,
    @Body() body: RegisterAttendeeQRDto,
  ) {
    let email: string = null;

    try {
      const payload = await this.jwtService.verifyAsync(body.token, {
        secret: process.env.JWT_SECRET,
      });
      email = payload.email;
    } catch {
      throw new BadRequestException('Could not decode the provided token');
    }

    if (!email || email.length == 0) {
      throw new BadRequestException('Token does not contain a valid email');
    }

    const attendee = await this.attendeeService.findAttendeeByEmail(email);
    if (!attendee) {
      throw new NotFoundException(
        `Could not find an attendee with email ${email}`,
      );
    }

    const { status, message, priority } =
      await this.eventsService.registerAttendance(
        eventId,
        attendee._id.toString(),
      );

    if (status != HttpStatus.ACCEPTED) {
      throw new HttpException(message, status);
    }

    return { status, message, priority };
  }

  @Get('schedule/days')
  schedule() {
    return this.eventsService.schedule();
  }
}
