import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './role.schema';
import { RoleService } from './role.service';
import { RolesGuard } from './role.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
  ],
  controllers: [],
  providers: [RolesGuard, RoleService],
  exports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    RoleService,
  ],
})
export class RoleModule {}
