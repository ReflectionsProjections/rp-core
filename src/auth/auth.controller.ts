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

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

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

    // TODO Set cookie upon verification
    res.cookie('token', 'blablabla', {
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
