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
  Req,
  BadRequestException,
} from '@nestjs/common';
import { AttendeeService } from './attendees.service';
// import { EventsService } from './events.service';
import { CreateAttendeeDto } from './dto/create-attendee.dto';
import { UpdateAttendeeDto } from './dto/update-attendee.dto';
import { AuthGuard } from '../auth/auth.guard';
import { WalletService } from '../wallet/wallet.service';
import * as QRCode from 'qrcode';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Controller('attendee')
export class AttendeeController {
  constructor(
    private readonly attendeeService: AttendeeService,
    private walletService: WalletService,
    private jwtService: JwtService,
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

  /**
   * Usage on the frontend:
   * 1. Call /attendee/qr --> get data URL from response body
   * 2. Use data url like so:
   * <img src={dataURL} alt="Attendee QR Code Pass"/>
   * @returns an image data URL
   */
  @Get('/qr')
  @UseGuards(AuthGuard)
  async getQRCode(@Req() req: Request) {
    let email: string = req['user']?.email;
    if (!email) {
      throw new BadRequestException('User email could not be found');
    }
    const signed_payload = await this.jwtService.signAsync({ email });
    const qr_data_url = await QRCode.toDataURL(signed_payload);
    return qr_data_url;
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
