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

  @Controller('carp')
  export class CarpController {
  
    constructor(
      private readonly s3ModuleService: S3Service,
      private readonly carpService: CarpService,
    ) {}

    /**
     * This function returns a link to the user's resume.
     * 
     * @param {string} email - Represents the email address of an attendee.
     */
  
    @Get('/resume/:email')
    @UseGuards(AuthGuard)
    async getResume(@Param('email') email:string) {
        return this.carpService.getResume(email);
    }

  } 