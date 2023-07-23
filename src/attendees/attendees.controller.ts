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
  async create(@Body() createAttendeeDto: CreateAttendeeDto) {
    const createdAttendee = await this.attendeeService.create(createAttendeeDto);
    const attendeeId = createdAttendee._id.toString();

    return createdAttendee;
  }
  
  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Body('attendeeName') attendeeName: string,
    @Body('attendeeId') attendeeId: string,
    @Res() res: Response,
    @Req() request: Request, 
  ) {
    try {
      const presignedUrl = await this.s3ModuleService.getPresignedURL(file, attendeeId, attendeeName);

      const blob = new Blob([file.buffer]);

      const response = await fetch(presignedUrl, {
        method: 'PUT',
        body: blob,
        headers: {
          'Content-Type': file.mimetype,
        },
      });

      res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
      return { success: true, message: 'File uploaded successfully' };
    } catch (error) {
      throw new HttpException('Failed to upload file', HttpStatus.INTERNAL_SERVER_ERROR);
    }
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