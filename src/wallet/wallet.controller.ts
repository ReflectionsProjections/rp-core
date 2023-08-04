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
import { AuthGuard } from 'src/auth/auth.guard';
import { AttendeeService } from 'src/attendees/attendees.service';

@Controller('wallet')
export class WalletController {
  constructor(
    private readonly walletService: WalletService,
    private readonly attendeeService: AttendeeService,
    private jwtService: JwtService,
  ) {}

  @UseGuards(AuthGuard)
  @Get('/wallet-auth')
  async generatePass(
    @Req() req: Request,
    @Res({ passthrough: true }) res: Response,
  ) {
    const attendeeEmail = req['user'].email;
    //encode attendee email into JWT
    const payload = { email: attendeeEmail };
    const userAuthToken = await this.jwtService.signAsync(payload);
    //Use email to fetch attendee email
    const attendeeName = (
      await this.attendeeService.findAttendeeByEmail(attendeeEmail)
    ).name;
    return await this.walletService.getGooglePass(attendeeEmail, attendeeName, userAuthToken);
  }
}
