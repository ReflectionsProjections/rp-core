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
// import { EventsService } from './events.service';
import { CreateAttendeeDto } from './dto/create-attendee.dto';
import { UpdateAttendeeDto } from './dto/update-attendee.dto';
import { AuthGuard } from '../auth/auth.guard';

import { UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { S3Service } from 'src/s3/s3.service';
import { HttpException, HttpStatus } from '@nestjs/common';
import { Response } from 'express';

@Controller('attendee')
export class AttendeeController {

  constructor(
    private readonly attendeeService: AttendeeService,
    private readonly s3ModuleService: S3Service,
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
  @UseGuards(AuthGuard)
  async create(@Body() createAttendeeDto: CreateAttendeeDto) {
    const createdAttendee = await this.attendeeService.create(createAttendeeDto);
    const attendeeId = createdAttendee._id.toString();

    // call upload using email

    // or maybe, dont return anything???

    console.log("New attendeeID: ", attendeeId);

    return createdAttendee;
  }

  @Post('upload')
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, 
    // @Body('attendeeId') attendeeId: string, // not needed
    // @Body('attendeeEmail') attendeeEmail: string,
    @Res() res: Response,
    @Req() req: Request, 
  ) {
    const bucketName: string = process.env.AWS_S3_BUCKET;
    // const attendeeId = this.attendeeService.findAttendeeByEmail(attendeeEmail);

    const attendeeId = (await this.attendeeService.findAttendeeByEmail(req['user'].email))._id.toString();

    // get attendeeID by lookup rather than by direct param

    try {
      const uploadResult = await this.s3ModuleService.uploadFile(file, bucketName, attendeeId);
      res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
      console.log("File uploaded successfully");
      return { success: true, message: 'File uploaded successfully', key: uploadResult.key };
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

  @Get(':email')
  findAttendeeByEmail(@Param('email') email: string) {
    return this.attendeeService.findAttendeeByEmail(email);
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