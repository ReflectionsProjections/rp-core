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

  /**
   * Returns attendees with filters applied
   * 
   * @param majors string of majors delimited by +
   * @param years string of years delimited by +
   * @param jobs string of job interests delimted by +
   */
  async getFilteredAttendees(majors: string, years: string, jobs: string) {
    const attendees = await this.attendeeService.findAll();
    const major_filters = majors.split('+');
    const grad_year_filters = years.split('+');
    const job_interest_filters = jobs.split('+');

    let filtered_attendees = []
		for (const attendee of attendees) {
      let showAttendee: Boolean = true
      if (major_filters.length != 0 && 
        !major_filters.includes(attendee.studentInfo.major)) {
        showAttendee = false;
      }
  
      if (grad_year_filters.length != 0 && 
        !grad_year_filters.includes(attendee.studentInfo.graduation)) {
        showAttendee = false;
      }
  
      // let job_check = false;
      // for (const job of attendee.job_interest) {
      //   if (job_interest_filters.length != 0 && 
      //     job_interest_filters.includes(job.type)) {
      //     job_check = true;
      //     break;
      //   }
      // }
      // if (!job_check) {
      //   showAttendee = false;
      // }

      if (job_interest_filters.length != 0 && 
        !attendee.job_interest.some(job => 
          job_interest_filters.includes(job.type))) {
        showAttendee = false;
      }

			if (showAttendee) {
				filtered_attendees.push(attendee);
			}
		}

    return filtered_attendees;
  }
}