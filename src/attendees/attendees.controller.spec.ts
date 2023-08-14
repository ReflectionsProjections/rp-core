import { getModelToken } from '@nestjs/mongoose';
import { Test, TestingModule } from '@nestjs/testing';
import { Model } from 'mongoose';
import { AuthGuard } from '../auth/auth.guard';
import { EmailService } from '../email/email.service';
import { S3ModuleModule } from '../s3/s3.module';
import { S3Service } from '../s3/s3.service';
import { AttendeeController } from './attendees.controller';
import { Attendee } from './attendees.schema';
import { AttendeeService } from './attendees.service';
import { S3Client } from '@aws-sdk/client-s3';
import { AppModule } from '../app.module';

describe('AttendeeService', () => {
  let controller: AttendeeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [AppModule, S3ModuleModule],
      controllers: [AttendeeController],
      providers: [
        { provide: 'S3Client', useValue: new S3Client() },
        AttendeeService,
        {
          provide: getModelToken(Attendee.name),
          useValue: Model,
        },
        {
          provide: EmailService,
          useValue: {
            get: jest.fn((key: string) => {}),
          },
        },
        S3Service,
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: (_context) => true,
      })
      .compile();

    controller = module.get<AttendeeController>(AttendeeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
