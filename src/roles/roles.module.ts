import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './role.schema';
import { RolesService } from './roles.service';
import { RolesGuard } from './roles.guard';
import { RolesController } from './roles.controller';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
  ],
  controllers: [RolesController],
  providers: [RolesGuard, RolesService],
  exports: [
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    RolesService,
  ],
})
export class RolesModule {}
