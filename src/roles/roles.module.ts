import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './role.schema';
import { RolesService } from './roles.service';
import { RolesGuard } from './roles.guard';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
  ],
  controllers: [],
  providers: [RolesGuard, RolesService],
  exports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    RolesService,
  ],
})
export class RolesModule {}
