import { Injectable } from '@nestjs/common';
import { AttendeeService } from '../attendees/attendees.service';
import { S3Service } from '../s3/s3.service';

@Injectable()
export class CarpService {
  constructor(
    private attendeeService: AttendeeService,
    private s3Service: S3Service,
  ) {}

  /**
   * Gets the attendee corresponding to the email, and calls the s3 service
   * to get the resume url.
   *
   * @param email Email address of the user
   */
  async getResume(id: string) {
    const attendee = await this.attendeeService.findOne(id);
    const attendeeId = attendee._id.toString();
    const attendeeName = attendee.name;
    const bucketName = process.env.AWS_S3_BUCKET;

    return this.s3Service.getFileUrl(attendeeId, attendeeName, bucketName);
  }
}