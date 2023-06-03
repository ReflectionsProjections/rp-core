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

    // Set cookie upon verification
    return message;
  }

  @Post('/verify')
  async verifyPasscode(
    @Body() body: VerifyPasscodeDto,
    @Res({ passthrough: true }) res,
  ) {
    const { status, message } = await this.authService.verifyPasscode(
      body.email,
      body.passcode,
    );

    if (status != HttpStatus.OK) {
      throw new HttpException(message, status);
    }

    // Set cookie upon verification
    return message;
  }

  @Get('/me')
  getLoggedInUser() {
    // TODO: getLoggedInUser
  }
}
