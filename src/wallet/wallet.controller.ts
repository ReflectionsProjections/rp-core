import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { WalletService } from './wallet.service';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import { WalletGuard } from './wallet.guard';
import { AttendeeService } from 'src/attendees/attendees.service'
// import { AttendeeService } from 'src/attendees/attendees.service';

@Controller('wallet')
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly attendeeService: AttendeeService
  ) {}

  @UseGuards(WalletGuard)
  @Post('/wallet-auth')
  async generatePass(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const attendeeEmail = req["user"].email
    //Use email to fetch attendee email
    const attendeeName = (await this.attendeeService.findAttendeeByEmail(attendeeEmail)).name
    // console.log(attendeeEmail + " EMAIL")
    // console.log(attendeeName + " NAME")
    return((await this.walletService.getGooglePass(attendeeEmail, attendeeName)))
  }
}
