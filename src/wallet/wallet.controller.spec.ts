import { Test, TestingModule } from '@nestjs/testing';
import { WalletController } from './wallet.controller';
import { ExecutionContext } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WalletService } from './wallet.service';
import { AttendeeService } from '../attendees/attendees.service';

describe('WalletController', () => {
  let controller: WalletController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
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
        WalletService,
      ],
      controllers: [WalletController],
    }).compile();

    
    controller = module.get<WalletController>(WalletController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
