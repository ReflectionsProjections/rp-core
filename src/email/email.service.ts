import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private defaultFrom = {
    email: 'noreply@reflectionsprojections.org',
    name: 'Reflections Projections',
  };
  private basicTemplateId = 'd-44805d25aa9f45edaea5c02e4544e6d2';
  private verificationTemplateId = 'd-3cd778fc91f54d209127f8c14242904d';

  constructor(private readonly configService: ConfigService) {
    SendGrid.setApiKey(this.configService.get('SENDGRID_API_KEY'));
  }

  async sendVerificationEmail(to: string, code: string) {
    this.send({
      from: this.defaultFrom,
      to,
      templateId: this.verificationTemplateId,
      dynamicTemplateData: {
        code,
      },
    });
  }

  async sendBasicEmail({ to, subject, text }) {
    this.send({
      from: this.defaultFrom,
      to,
      subject,
      templateId: this.basicTemplateId,
      dynamicTemplateData: {
        subject,
        text,
      },
    });
  }

  async send(mail: SendGrid.MailDataRequired) {
    const transport = await SendGrid.send(mail);
    this.logger.log(`Sent email to ${mail.to}`);
    return transport;
  }
}
