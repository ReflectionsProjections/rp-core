import { Controller, Get } from '@nestjs/common';
import { EmailService } from './email.service';

@Controller('email')
export class EmailController {
  constructor(private readonly emailService: EmailService) {}

  // TODO: Remove this endpoint before going to prod!
  @Get()
  sendVerificationCodeExample() {
    const code = '135315';
    return this.emailService.sendBasicEmail({
      subject: `${code} is your code`,
      text: `Your verification code is ${code}`,
      to: 'sohamk2@illinois.edu',
    });
  }
}
