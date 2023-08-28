import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../roles/roles.decorator';
import { RoleLevel } from '../roles/roles.enum';
import { RolesGuard } from '../roles/roles.guard';
import { S3Service } from '../s3/s3.service';
import { CarpService } from './carp.service';

@Controller('carp')
export class CarpController {
  constructor(private readonly carpService: CarpService) {}

  /**
   * This function returns a link to the user's resume.
   *
   * @param {string} id - Represents attendee id
   */
  @Get('/resume/:id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleLevel.Corporate)
  async getResume(@Param('id') id: string) {
    return this.carpService.getResume(id);
  }
}
