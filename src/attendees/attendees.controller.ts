import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UploadedFile,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { Request } from 'express';
import { AuthGuard } from '../auth/auth.guard';
import { S3Service } from '../s3/s3.service';
import { AttendeeService } from './attendees.service';
import { CreateAttendeeDto } from './dto/create-attendee.dto';
import { UpdateAttendeeDto } from './dto/update-attendee.dto';

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
    const createdAttendee = await this.attendeeService.create(
      createAttendeeDto,
    );
    return createdAttendee;
  }

  @Post('upload')
  @UseGuards(AuthGuard)
  @UseInterceptors(FileInterceptor('file'))
  async uploadFile(
    @UploadedFile() file: Express.Multer.File,
    @Req() req: Request,
  ) {
    const bucketName: string = process.env.AWS_S3_BUCKET;
    const email = req['user'].email;

    if (!email) {
      throw new BadRequestException('User email could not be determined');
    }

    const attendee = await this.attendeeService.findAttendeeByEmail(email);
    const attendeeId = attendee._id.toString();
    const attendeeName = attendee.name;

    const result = await this.s3ModuleService.uploadFile(
      file,
      bucketName,
      attendeeId,
      attendeeName,
    );

    if (result.success) {
      return 'File uploaded successfully';
    } else {
      throw new HttpException(result.message, HttpStatus.INTERNAL_SERVER_ERROR);
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
