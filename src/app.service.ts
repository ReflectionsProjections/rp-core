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
   */
  getVersion(): string {
    return 'v1.1.2';
  }
}
