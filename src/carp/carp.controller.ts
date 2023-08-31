import { Controller, Get, NotImplementedException, Param, Query, UseGuards } from '@nestjs/common';
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

  /**
   * This function returns a filtered list of attendess.
   * 
   * @param filters Filters can be passed as query params 
   * 'majors', 'years', and 'jobs'. Multiple filters within each param should be
   * delimited by '+'
   */
  @Get('/filter')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles(RoleLevel.Corporate)
  async getFilters(@Query() filters: any) {
    const majors = filters.majors;
    const years = filters.years;
    const jobs = filters.jobs
    return NotImplementedException;
    // return this.carpService.getFilters(majors, years, jobs);
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
  async getAllResumes(@Query() filters: any) {
    const majors = filters.majors;
    const years = filters.years;
    const jobs = filters.jobs
    return NotImplementedException;
    // return this.carpService.getAllResumes(majors, years, jobs);
  }
  
}