import { HttpService } from '@nestjs/axios';
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
  private welcomeTemplateId = 'd-e9975d0abc524fae834cf20861596cdc';

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {
    SendGrid.setApiKey(this.configService.get('SENDGRID_API_KEY'));
  }

  async sendWelcomeEmail(
    to: string,
    addToWalletLink: string,
    passImageUrl: string,
    firstName: string,
  ) {
    passImageUrl = passImageUrl.replace('data:image/png;base64,', '');
    this.httpService.axiosRef
      .post(
        'https://api.sendgrid.com/v3/mail/send',
        {
          from: this.defaultFrom,
          personalizations: [
            {
              from: this.defaultFrom,
              to: [{ email: to }],
              dynamic_template_data: {
                firstName,
                addToWalletLink,
              },
              template_id: this.welcomeTemplateId,
            },
          ],
          template_id: this.welcomeTemplateId,
          subject: 'Your R|P passes',
          attachments: [
            {
              content_id: 'qrpass',
              filename: 'qrpass.png',
              content: passImageUrl,
              disposition: 'inline',
              type: 'image/png',
            },
          ],
        },
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.configService.get(
              'SENDGRID_API_KEY',
            )}`,
            'Content-Type': 'application/json',
          },
        },
      )
      .then(() => {
        this.logger.log(`Sent welcome email to ${to}`);
      })
      .catch((error) => {
        if (error.response) {
          this.logger.error(error.response.status);
          this.logger.error(error.response.data);
        }
      });
  }

  async addContactToMarketingList(email: string, firstName: string) {
    this.httpService.axiosRef
      .put(
        'https://api.sendgrid.com/v3/marketing/contacts',
        {
          contacts: [
            {
              email,
              first_name: firstName,
            },
          ],
        },
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${this.configService.get(
              'SENDGRID_API_KEY',
            )}`,
            'Content-Type': 'application/json',
          },
        },
      )
      .then(() => {
        this.logger.log(`Added ${email} to contact list`);
      })
      .catch((error) => {
        if (error.response) {
          this.logger.error(error.response.status);
          this.logger.error(error.response.data);
        }
      });
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
    this.logger.log(`Sent verification email to ${to}`);
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
    return transport;
  }
}
