<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://avatars.githubusercontent.com/u/25068122?s=200&v=4" width="100" alt="RP Logo" /></a>
</p>

# R|P Core

Core backend infrastructure for Reflections | Projections, powered by Nest.js

## About 

RP Core serves key endpoints used by Reflections Projections to manage events, provide attendee insights and incentives, produce metrics on the conference and automate logistics for the conference. It is integrated with the R|P website (rp2023) and QR|P.

## Installation

- Clone this repository

- Create `.env` in project root with the following values:

```properties
DATABASE_URL=<mongodb_uri_here>
SENDGRID_API_KEY=<sendgrid_api_key>
ENV=<dev | test | prod ...>
JWT_SECRET=<secure_jwt_secret>
GOOGLE_ISSUER_ID=<google_wallet_api_issuer_id>
GOOGLE_PRIV_KEY_ID=<google_service_acct_private_key_id>
GOOGLE_PRIV_KEY=<google_service_acct_private_key>
GOOGLE_CLIENT_EMAIL=<google_service_acct_client_email>
GOOGLE_CLIENT_ID=<google_service_acct_client_id>
GOOGLE_CLIENT_509_CERT_URL=<google_service_client_509_url>
```

- Install dependencies

```bash
$ yarn
```

## Running the app

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev
# OR
$ yarn dev

# production mode
$ yarn run start:prod
```

## Test

```bash
# unit tests
$ yarn run test

# e2e tests
$ yarn run test:e2e

# test coverage
$ yarn run test:cov
```

## Support

Create a GitHub issue to for any bug reports or other requests

## License

R|P Core is proprietary, closed source software as of June 2023. 
