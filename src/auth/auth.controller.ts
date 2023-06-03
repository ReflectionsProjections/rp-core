import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { GeneratePasscodeDto } from './dto/generate-passcode.dto';
import { VerifyPasscodeDto } from './dto/verify-passcode.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/generate')
  generateVerificationPasscode(@Body() body: GeneratePasscodeDto) {
    this.authService.generateVerificationPasscode(body.email);
  }

  @Post('/verify')
  async verifyPasscode(@Body() body: VerifyPasscodeDto) {
    const { status, reason } = await this.authService.verifyPasscode(
      body.email,
      body.passcode,
    );

    if (status != HttpStatus.OK) {
      throw new HttpException({ reason }, status);
    }
  }

  @Post('/retry')
  regenerateVerificationPasscode() {
    // TODO: regenerateVerificationPasscode
  }

  @Get('/me')
  getLoggedInUser() {
    // TODO: getLoggedInUser
  }
}
