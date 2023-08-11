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
import { AuthGuard } from '../auth/auth.guard';
import { UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { S3Service } from '../s3/s3.service';
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
    return createdAttendee;
  }

  @Post('upload')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(@UploadedFile() file: Express.Multer.File, 
    @Res() res: Response,
    @Req() req: Request, 
  ) {

    console.log("calling upload file");
    const bucketName: string = process.env.AWS_S3_BUCKET;

    const attendee = await this.attendeeService.findAttendeeByEmail(req['user'].email);
    const attendeeId = attendee._id.toString();
    const attendeeName = attendee.name;

    try {
      const uploadResult = await this.s3ModuleService.uploadFile(file, bucketName, attendeeId, attendeeName);
      console.log("File uploaded successfully");
      return { success: true, message: 'File uploaded successfully', key: uploadResult.key };
    } catch (error) {
      throw new HttpException('Failed to upload file', error);
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