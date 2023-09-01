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
import { AuthService } from './auth.service';
import { GeneratePasscodeDto } from './dto/generate-passcode.dto';
import { VerifyPasscodeDto } from './dto/verify-passcode.dto';
import { Response, Request } from 'express';
import { JwtService } from '@nestjs/jwt';
import * as dayjs from 'dayjs';
import { AuthGuard } from './auth.guard';
import { AttendeeService } from '../attendees/attendees.service';
import { RolesGuard } from '../roles/roles.guard';
import { Roles } from '../roles/roles.decorator';
import { RoleLevel } from '../roles/roles.enum';
import { WalletService } from '../wallet/wallet.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly attendeeService: AttendeeService,
    private jwtService: JwtService,
    private walletService: WalletService,
  ) {}

  @Post('/generate')
  async generateVerificationPasscode(
    @Body() body: GeneratePasscodeDto,
    @Query() query: { isLogin: string; isRegister: string },
  ) {
    const isLogin = query?.isLogin === 'true';
    const isRegister = query?.isRegister === 'true';

    const userExists = await this.attendeeService.userEmailExists(body.email);
    if (!userExists && isLogin) {
      throw new NotFoundException('User with that email does not exist.');
    } else if (userExists && isRegister) {
      throw new NotFoundException('User with that email already exists.');
    }

    const { status, message } =
      await this.authService.generateVerificationPasscode(body.email);

    if (status != HttpStatus.OK) {
      throw new HttpException(message, status);
    }

    return message;
  }

  @Post('/verify')
  async verifyPasscode(
    @Body() body: VerifyPasscodeDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { status, message } = await this.authService.verifyPasscode(
      body.email,
      body.passcode,
    );

    if (status != HttpStatus.OK) {
      throw new HttpException(message, status);
    }

    const development = process.env.ENV?.startsWith('dev');

    // TODO Add staff status to payload
    const payload = { email: body.email };
    const access_token = await this.jwtService.signAsync(payload);

    // Set cookie upon verification
    res
      .status(200)
      .cookie('token', access_token, {
        httpOnly: true,
        secure: !development,
        sameSite: development ? 'lax' : 'strict',
        path: '/',
      })
      .send(message);
  }

  @Get('/me')
  @UseGuards(AuthGuard)
  async getLoggedInUser(@Req() req: Request) {
    const email = req['user'].email;
    const attendee = await this.attendeeService.findAttendeeByEmail(email);
    if (!attendee) {
      return req['user'];
    }
    return {
      email,
      fullName: attendee.name,
      priority:
        attendee.priority_expiry != null &&
        !dayjs(attendee.priority_expiry).isBefore(dayjs()),
    };
  }

  @Get('/access/admin')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleLevel.Admin)
  staffAccessCheck(@Req() req: Request) {
    return 'Success';
  }

  @Get('/access/corporate')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleLevel.Corporate)
  corporateAccessCheck(@Req() req: Request) {
    return 'Success';
  }

  @Post('/logout')
  logout(@Res({ passthrough: true }) res: Response) {
    const development = process.env.ENV?.startsWith('dev');

    res
      .status(200)
      .clearCookie('token', {
        httpOnly: true,
        secure: !development,
        sameSite: development ? 'lax' : 'strict',
        path: '/',
      })
      .send('Success');
  }
}
