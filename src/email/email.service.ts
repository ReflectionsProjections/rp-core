import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as SendGrid from '@sendgrid/mail';

@Injectable()
export class EmailService {
  private readonly logger = new Logger(EmailService.name);
  private defaultFrom = 'noreply@reflectionsprojections.org';
  private basicTemplateId = 'd-44805d25aa9f45edaea5c02e4544e6d2';

  constructor(private readonly configService: ConfigService) {
    SendGrid.setApiKey(this.configService.get('SENDGRID_API_KEY'));
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
