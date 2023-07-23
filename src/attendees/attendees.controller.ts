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
import { AttendeeService } from './attendees.service';
import { CreateAttendeeDto } from './dto/create-attendee.dto';
import { UpdateAttendeeDto } from './dto/update-attendee.dto';
import { AuthGuard } from 'src/auth/auth.guard';

import { UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { S3ModuleService } from 'src/s3-module/s3-module.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Controller('attendee')
export class AttendeeController {

  constructor(
    private readonly attendeeService: AttendeeService,
    private readonly s3ModuleService: S3ModuleService,
    ) {}

  /**
   * This function checks if a user with a given email exists.
   * Throws NotFoundException if they do not.
   *
   * @param {string} email - Represents the email address of a user
   */
  @Get('/email/:email')
  async checkUserExists(@Param('email') email: string) {
    const userExists = await this.attendeeService.userEmailExists(email);
    if (!userExists) {
      throw new NotFoundException('User with that email does not exist.');
    }
  }

  @Post()
  // @UseGuards(AuthGuard)
  async create(@Body() createAttendeeDto: CreateAttendeeDto): Promise<string> {
    const createdAttendee = await this.attendeeService.create(createAttendeeDto);
    const attendeeId = createdAttendee._id.toString();
    const attendeeName = createdAttendee.name;

    const presignedUrl = await this.s3ModuleService.getPresignedURL(attendeeId, attendeeName);

    return presignedUrl;
  }

  @Get()
  findAll() {
    return this.attendeeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.attendeeService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateAttendeeDto: UpdateAttendeeDto,
  ) {
    return this.attendeeService.update(+id, updateAttendeeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.attendeeService.remove(id);
  }
}