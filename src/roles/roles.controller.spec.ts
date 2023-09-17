import { Test, TestingModule } from '@nestjs/testing';
import { RolesController } from './roles.controller';
import { RolesService } from './roles.service';
import { AuthGuard } from '../auth/auth.guard';
import { ExecutionContext } from '@nestjs/common';
import { RolesGuard } from './roles.guard';

describe('RolesController', () => {
  let controller: RolesController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RolesController],
      providers: [
        {
          provide: RolesService,
          useValue: {
            registerAttendance: jest.fn((eventId, attendeeId) => {}),
          },
        },
      ],
    })
      .overrideGuard(AuthGuard)
      .useValue({
        canActivate: (context: ExecutionContext) => {
          const request: Request = context.switchToHttp().getRequest();
          request['user'] = { email: 'test@rp.org' };
          return true;
        },
      })
      .overrideGuard(RolesGuard)
      .useValue({
        canActivate: (_context: ExecutionContext) => true,
      })
      .compile();

    controller = module.get<RolesController>(RolesController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
