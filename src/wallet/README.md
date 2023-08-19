# **Google Wallet Integration**

![Google Wallet](https://kstatic.googleusercontent.com/files/6bb8ff062945a1e19aafe50ee1c8c6820339d137cc189198f40e58114a08757c570a65d75cf8fc9ccb4614b77970a62a1098bd438acc9df063be91d8af30e9f7)

This document should provide a overview of the Google Wallet Endpoints and point to the high-level documentation and resources for the construction of these endpoints

## Service Account Setup

The Google Wallet Pass Type used in this instance is the [Event Pass](https://developers.google.com/wallet/tickets/events)

Before using the Google Wallet API, the following prerequisites should be followed

1. [Sign up for a Google Wallet API Issuer account](https://developers.google.com/wallet/tickets/events/web/prerequisites#1.-sign-up-for-a-google-wallet-api-issuer-account)
2. [Enable the Wallet API](https://developers.google.com/wallet/tickets/events/web/prerequisites#2.-enable-the-wallet-api)
3. [Create a service account](https://developers.google.com/wallet/tickets/events/web/prerequisites#3.-create-a-service-account)
4. [Authorize the service account](https://developers.google.com/wallet/tickets/events/web/prerequisites#4.-authorize-the-service-account)
5. [Create a class](https://developers.google.com/wallet/tickets/events/web/prerequisites#5.-create-a-class)

The above steps have their respective steps linked, but for a general read on all the steps you can access [this Google Wallet API Documentation](https://developers.google.com/wallet/tickets/events/web/prerequisites)

## Endpoint Authorization Setup

If not already created, make a `.env` file in project root with the following values obtained from the service account key and the Google Pay and Wallet Console:

```properties

#Including DATABASE_URL, SENDGRID_API_KEY, ENV, and JWT_SECRET as specified in the main README

GOOGLE_ISSUER_ID="<google_wallet_api_issuer_id>"
GOOGLE_PRIV_KEY_ID="<google_service_acct_private_key_id>"
GOOGLE_PRIV_KEY="<google_service_acct_private_key>"
GOOGLE_CLIENT_EMAIL="<google_service_acct_client_email>"
GOOGLE_CLIENT_ID="<google_service_acct_client_id>"
GOOGLE_CLIENT_509_CERT_URL="<google_service_client_509_url>"
```

_Note: Make sure all the Google Wallet values are in double-quotes!_

The Google Issuer ID can be found here in the [Google Pay and Wallet Passes Console](https://pay.google.com/business/console/passes)

![Google Pay and Wallet Console](https://support.ticketure.com/hc/article_attachments/6282091611533/Step_5_-_Issuer_ID.png)

And the remaining variables can be extracted from the service account key that was downloaded in the [Prerequisite Step #3](https://developers.google.com/wallet/tickets/events/web/prerequisites#create-a-service-account-key:)

## Optional, but recommended for codebase understanding: Original Repository

The primary code that was used for the endpoints was based off [this GitHub Repository](https://github.com/google-pay/wallet-web-codelab). The original endpoints were in Express.js, so some modifications were made for cleaner integration with Nest.js

To setup the above repository for reference, follow the steps in [this Codelab](https://codelabs.developers.google.com/add-to-wallet-web#0). Some steps will overlap with what was previously noted, so the steps can be skipped as necessary.

## Additional Information

To learn more about the properties and fields that can be modified with these passes, use the [Wallet Pass Builder](https://developers.google.com/wallet/generic/resources/pass-builder) as a tool to customize the pass as needed.

## Resources

- [Google Wallet Event Pass Information](https://developers.google.com/wallet/tickets/events)
- [Google Wallet API Setup Prerequisites](https://developers.google.com/wallet/tickets/events/web/prerequisites)
- [Google Pay and Wallet Passes Console](https://pay.google.com/business/console/passes)
- [Original Wallet Codelab GitHub Repository](https://github.com/google-pay/wallet-web-codelab)
- [Google Wallet Pass Builder](https://developers.google.com/wallet/generic/resources/pass-builder)
