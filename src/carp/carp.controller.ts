import {
  Controller,
  Get,
  InternalServerErrorException,
  NotImplementedException,
  Param,
  Query,
  Redirect,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { Roles } from '../roles/roles.decorator';
import { RoleLevel } from '../roles/roles.enum';
import { RolesGuard } from '../roles/roles.guard';
import { S3Service } from '../s3/s3.service';
import { CarpService } from './carp.service';
import { CarpFilterDto } from './dto/carp-filter.dto';
import { ConfigService } from '@nestjs/config';
import { Response } from 'express';

@Controller('carp')
export class CarpController {
  constructor(
    private readonly carpService: CarpService,
    private readonly configService: ConfigService,
  ) {}

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

  /**
   * This function returns a link to the user's resume.
   *
   * @param {string} id - Represents attendee id
   */
  @Get('/resume/permalink/:id')
  async doResumeRedirect(
    @Param('id') id: string,
    @Query('secret') secret: string,
    @Res() res: Response,
  ) {
    const SECRET = this.configService.get('CARP_SECRET');
    if (!secret || secret !== SECRET) {
      throw new UnauthorizedException();
    }
    const url = await this.carpService.getResume(id);
    res.redirect(url.url);
  }

  /**
   * This function returns a filtered list of attendees.
   *
   * @param filters Filters can be passed as query params
   * 'majors', 'years', and 'jobs'. Multiple filters within each param should be
   * delimited by '+'
   */
  @Get('/filter')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleLevel.Corporate)
  async getFilteredAttendees(@Query() filters: CarpFilterDto) {
    const majors = decodeURIComponent(filters.majors);
    const years = decodeURIComponent(filters.years);
    const jobs = decodeURIComponent(filters.jobs);
    const page = parseInt(filters.page);

    return this.carpService.getFilteredAttendees(majors, years, jobs, page);
  }

  /**
   * This function returns a list of all S3 URLs for the filters.
   *
   * @param filters Filters can be passed as query params
   * 'majors', 'years', and 'jobs'. Multiple filters within each param should be
   * delimited by '+'
   */
  @Get('/download')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleLevel.Corporate)
  async getAllResumes(@Query() filters: CarpFilterDto) {
    const majors = decodeURIComponent(filters.majors);
    const years = decodeURIComponent(filters.years);
    const jobs = decodeURIComponent(filters.jobs);
    return NotImplementedException;
    // return this.carpService.getAllResumes(majors, years, jobs);
  }
}
