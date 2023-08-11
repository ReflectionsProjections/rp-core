import {
  Controller,
  Get,
  Body,
  Patch,
  Post,
  Param,
  Delete,
  NotFoundException,
  UseGuards,
} from '@nestjs/common';
import { AttendeeService } from './attendees.service';
// import { EventsService } from './events.service';
import { CreateAttendeeDto } from './dto/create-attendee.dto';
import { UpdateAttendeeDto } from './dto/update-attendee.dto';
import { AuthGuard } from '../auth/auth.guard';
import { WalletService } from '../wallet/wallet.service';

@Controller('attendee')
export class AttendeeController {
  constructor(
    private readonly attendeeService: AttendeeService,
    private walletService: WalletService,
  ) {}

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
  @UseGuards(AuthGuard)
  async create(@Body() createAttendeeDto: CreateAttendeeDto) {
    const attendee = this.attendeeService.create(createAttendeeDto);
    const passURL = await this.walletService.generateEventPass(
      (
        await attendee
      ).email,
    );
    return { attendee, passURL };
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
