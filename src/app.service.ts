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
   * v1.1.4 -> Make cookie persistent by adding expiration date
   */
  getVersion(): string {
    return 'v1.1.5';
  }
}
