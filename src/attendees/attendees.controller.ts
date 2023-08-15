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
import { S3Service } from '../s3/s3.service';
import { AttendeeService } from './attendees.service';
import { CreateAttendeeDto } from './dto/create-attendee.dto';
import { UpdateAttendeeDto } from './dto/update-attendee.dto';
import { AuthGuard } from '../auth/auth.guard';
import { WalletService } from '../wallet/wallet.service';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { EmailService } from '../email/email.service';

@Controller('attendee')
export class AttendeeController {
  constructor(
    private readonly attendeeService: AttendeeService,
    private readonly s3ModuleService: S3Service,
    private readonly emailService: EmailService,
    private walletService: WalletService,
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
    const attendee = await this.attendeeService.create(createAttendeeDto);
    //// COMMENTED OUT FOR TESTING PURPOSES ////
    // const email = attendee.email;
    // console.log(email);
    // const firstName = attendee.name.split(' ')[0];
    // const walletLink = await this.walletService.generateEventPass(email);
    // const passUrl = await this.attendeeService.getQRPassImageDataURL(email);
    // await this.emailService.sendWelcomeEmail(
    //   email,
    //   walletLink,
    //   passUrl,
    //   firstName,
    // );
    return 'Success';
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

    console.log(file.size);
    console.log(file.mimetype);

    const maxSize = 1024 * 1024 * 10;
    if (file.size > maxSize) {
      throw new BadRequestException('File size exceeds the limit of 10MB.');
    }

    const allowedMimeTypes = ['application/pdf', 'image/jpeg', 'image/png'];
    if (!allowedMimeTypes.includes(file.mimetype)) {
      console.log("Uploaded file type:", file.mimetype);
      throw new BadRequestException('Invalid file type. Please upload a PDF, JPEG, or PNG.');
    }

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

  /**
   * Usage on the frontend:
   * 1. Call /attendee/qr --> get data URL from response body
   * 2. Use data url like so:
   * <img src={dataURL} alt="Attendee QR Code Pass"/>
   * @returns an image data URL
   */
  @Get('/qr')
  @UseGuards(AuthGuard)
  async getQRCode(@Req() req: Request) {
    let email: string = req['user']?.email;
    if (!email) {
      throw new BadRequestException('User email could not be found');
    }
    return this.attendeeService.getQRPassImageDataURL(email);
  }

  @Get('/wallet/google')
  @UseGuards(AuthGuard)
  async getGoogleWalletUrl(@Req() req: Request) {
    let email: string = req['user']?.email;
    if (!email) {
      throw new BadRequestException('User email could not be found');
    }
    return await this.walletService.generateEventPass(email);
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
