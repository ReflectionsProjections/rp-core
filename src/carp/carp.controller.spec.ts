import { Test, TestingModule } from '@nestjs/testing';
import { getModelToken } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { AuthGuard } from '../auth/auth.guard';
import { CarpController } from './carp.controller';
import { CarpService } from './carp.service';
import { AttendeeService } from '../attendees/attendees.service';
import { S3Service } from '../s3/s3.service';
import { S3ModuleModule } from '../s3/s3.module';
import { Attendee } from '../attendees/attendees.schema';
import { AppModule } from '../app.module';
import { S3Client } from '@aws-sdk/client-s3';


describe('CarpController', () => {
  let controller: CarpController;
  beforeEach(async () => {
      const module: TestingModule = await Test.createTestingModule({
        imports: [AppModule, S3ModuleModule],
        controllers: [CarpController],
        providers: [CarpService, 
          AttendeeService, 
          S3Service,
          {
            provide: getModelToken(Attendee.name),
            useValue: Model,
          },
          {
            provide: 'S3Client',
            useClass: S3Client,
          },
        ],
      })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: (_context) => true,
      })
      .compile();

      controller = module.get<CarpController>(CarpController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
