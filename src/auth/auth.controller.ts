import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GeneratePasscodeDto } from './dto/generate-passcode.dto';
import { VerifyPasscodeDto } from './dto/verify-passcode.dto';
import { Response } from 'express';
import { JwtService } from '@nestjs/jwt';

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private jwtService: JwtService,
  ) {}

  @Post('/generate')
  async generateVerificationPasscode(@Body() body: GeneratePasscodeDto) {
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
    res.cookie('token', access_token, {
      httpOnly: true,
      secure: !development,
      sameSite: !development,
    });
    return message;
  }

  @Get('/me')
  getLoggedInUser(@Res({ passthrough: true }) res: Response) {
    // TODO: getLoggedInUser

    const development = process.env.ENV?.startsWith('dev');

    return `uhh: development: ${process.env.ENV}`;
  }
}
