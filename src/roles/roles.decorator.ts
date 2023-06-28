import { SetMetadata } from '@nestjs/common';
import { RoleLevel } from './roles.enum';

export const Roles = (...roles: RoleLevel[]) => SetMetadata('roles', roles);
