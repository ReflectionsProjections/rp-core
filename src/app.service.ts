import { Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  /**
   * --- Version Log ---
   * v1.0.0 -> Release Day API
   * v1.0.* -> Minor fixes not affecting API outputs
   * v1.1.0 -> Endpoints supporting preferences page
   * v1.1.1 -> Add endpoint for fetching schedule data
   * v1.1.2 -> Add carp endpoints for serving resumes
   * v1.1.3 -> Adding priority expiry to attendees
   * v1.1.4 -> Return metadata from attendance endpoints
   * v1.1.5 -> Make cookie persistent by adding expiration date
   * v1.1.6 -> Add endpoint for conference schedule
   * v1.2.0 -> Ready carp for release
   * v1.2.1 -> Add has_resume field to attendees collection
   * v1.2.2 -> Return prior_check_in from QRP endpoints
   * v1.2.3 -> Carp only shows attendees with resumes
   * v1.2.4 -> Add saturday events to schedule
   * v1.2.5 -> Remove rate limiting from endpoints
   * v1.2.6 -> Add Lottery endpoint
   * v1.2.7 -> Fix lottery bias for earlier events
   * v1.2.8 -> Add permalink endpoint for carp resume access
   */
  getVersion(): string {
    return 'v1.2.8';
  }
}
