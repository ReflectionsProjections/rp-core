import { Body, Controller, Get, Post } from '@nestjs/common';
import { GeneratePasscodeDto } from './dto/generate-passcode.dto';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('/generate')
  generateVerificationPasscode(@Body() body: GeneratePasscodeDto) {
    // TODO: generateVerificationPasscode
    this.authService.generateVerificationPasscode(body.email);
  }

  @Post('/verify')
  verifyPasscode() {
    // TODO: verifyPasscode
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
