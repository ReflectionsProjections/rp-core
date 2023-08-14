import { Test, TestingModule } from '@nestjs/testing';
import { WalletService } from './wallet.service';
import { AttendeeService } from '../attendees/attendees.service';
import { ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

describe('WalletService', () => {
  let service: WalletService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        WalletService,
        {
          provide: AttendeeService,
          useValue: {
            get: jest.fn((key: string) => {}),
          },
        },
        {
          provide: JwtService,
          useValue: {
            canActivate: jest.fn((context: ExecutionContext) => {
              const req = context.switchToHttp().getRequest();
              req.user = {};
              return true;
            }),
          },
        },
      ],
    }).compile();

    service = module.get<WalletService>(WalletService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
