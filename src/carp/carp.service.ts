import { Injectable } from '@nestjs/common';
import { AttendeeService } from '../attendees/attendees.service';
import { S3Service } from '../s3/s3.service';

@Injectable()
export class CarpService {
  // Constant for attendees per page
  readonly attendeesPerPage = 30;

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
   * Helper function to filter attendees
   *
   * @param attendees list of all attendees
   * @param majorFilters list of major filters
   * @param gradYearFilters list of grad year filters
   * @param jobInterestFilters list of job interest filters
   * @returns filtered list of attendees
   */
  async filterAttendees(
    attendees,
    majorFilters: string[],
    gradYearFilters: string[],
    jobInterestFilters: string[],
  ) {
    // Filter attendees
    let filteredAttendees = [];
    for (const attendee of attendees) {
      let showAttendee: Boolean = true;
      if (
        majorFilters.length != 0 &&
        !majorFilters.some((majorFilter) =>
          attendee.studentInfo.major.includes(majorFilter),
        )
      ) {
        showAttendee = false;
      }

      if (
        gradYearFilters.length != 0 &&
        !gradYearFilters.includes(attendee.studentInfo.graduation)
      ) {
        showAttendee = false;
      }

      if (
        jobInterestFilters.length != 0 &&
        !attendee.job_interest.some((job) => jobInterestFilters.includes(job))
      ) {
        showAttendee = false;
      }

      if (showAttendee) {
        filteredAttendees.push(attendee);
      }
    }

    return filteredAttendees;
  }

  /***
   * Helper function that paginates the data, and returns the correct subset of
   * attendees in the correct json format.
   *
   * @param attendees prefiltered list of attendees
   * @param page desired page
   * @returns JSON object { num_pages, curr_page, attendees }
   */
  async handlePagination(attendees, page: number) {
    let num_pages = Math.ceil(attendees.length / this.attendeesPerPage);
    let slice = attendees.slice(
      this.attendeesPerPage * (page - 1),
      this.attendeesPerPage * (page - 1) + this.attendeesPerPage,
    );

    return { num_pages: num_pages, curr_page: page, attendees: slice };
  }

  /**
   * Returns attendees with filters applied
   *
   * @param majors string of majors delimited by +
   * @param years string of years delimited by +
   * @param jobs string of job interests delimted by +
   */
  async getFilteredAttendees(
    majors: string,
    years: string,
    jobs: string,
    page: number,
  ) {
    const attendees = await this.attendeeService.findAll();

    // Check no filters
    if (majors == '' && years == '' && jobs == '') {
      return await this.handlePagination(attendees, page);
    } else {
      const majorFilters = majors ? majors.split(',') : [];
      const gradYearFilters = years ? years.split(',') : [];
      const jobInterestFilters = jobs ? jobs.split(',') : [];

      let filteredAttendees = await this.filterAttendees(
        attendees,
        majorFilters,
        gradYearFilters,
        jobInterestFilters,
      );
      return await this.handlePagination(filteredAttendees, page);
    }
  }
}
