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
import { AuthGuard } from './auth.guard';
import { AttendeeService } from '../attendees/attendees.service';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly attendeeService: AttendeeService,
    private jwtService: JwtService,
  ) {}

  @Post('/generate')
  async generateVerificationPasscode(
    @Body() body: GeneratePasscodeDto,
    @Query() query: { isLogin: string },
  ) {
    const isLogin = query?.isLogin === 'true';

    if (isLogin) {
      const userExists = await this.attendeeService.userEmailExists(body.email);
      if (!userExists) {
        throw new NotFoundException('User with that email does not exist.');
      }
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
  getLoggedInUser(@Req() req: Request) {
    // Attach additional user information as needed
    // Lookup attendee based on their (unique) email
    return req['user'];
  }
}
