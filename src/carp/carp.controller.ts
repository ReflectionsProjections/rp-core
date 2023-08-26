import {
    Controller,
    Get,
    Body,
    Patch,
    Post,
    Param,
    Delete,
    NotFoundException,
    UseGuards,
    Res,
    Req,
  } from '@nestjs/common';
  import { AuthGuard } from '../auth/auth.guard';
  import { UploadedFile, UseInterceptors } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { S3Service } from '../s3/s3.service';
  import { HttpException, HttpStatus } from '@nestjs/common';
  import { Response } from 'express';
  import { CarpService } from './carp.service';
  import { RolesGuard } from '../roles/roles.guard';
  import { RoleLevel } from '../roles/roles.enum';
  import { Roles } from '../roles/roles.decorator';
  
  @Controller('carp')
  export class CarpController {
    constructor(
      private readonly s3Service: S3Service,
      private readonly carpService: CarpService,
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
  }