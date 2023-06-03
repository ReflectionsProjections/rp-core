import { Controller, Get, Post } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  @Post('/generate')
  generateVerificationPasscode() {
    // TODO: generateVerificationPasscode
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
