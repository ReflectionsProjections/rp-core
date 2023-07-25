import { Injectable, Logger } from '@nestjs/common';
const { GoogleAuth } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const baseUrl = 'https://walletobjects.googleapis.com/walletobjects/v1';

@Injectable()
export class WalletService {
  private readonly logger = new Logger(WalletService.name);
  private readonly issuerId = process.env.GOOGLE_ISSUER_ID;
  private readonly classId = `${this.issuerId}.codelab_class`;
  //Defining the credentials JSON used to validate the Google Pass Provider
  private readonly credentials = {
    type: 'service_account',
    project_id: 'qrp-test',
    private_key_id: `${process.env.GOOGLE_PRIV_KEY_ID}`,
    private_key: `${process.env.GOOGLE_PRIV_KEY}`,
    client_email: `${process.env.GOOGLE_CLIENT_EMAIL}`,
    client_id: `${process.env.GOOGLE_CLIENT_ID}`,
    auth_uri: 'https://accounts.google.com/o/oauth2/auth',
    token_uri: 'https://oauth2.googleapis.com/token',
    auth_provider_x509_cert_url: 'https://www.googleapis.com/oauth2/v1/certs',
    client_x509_cert_url: `${process.env.GOOGLE_CLIENT_509_CERT_URL}`,
    universe_domain: 'googleapis.com',
  };
  private readonly httpClient = new GoogleAuth({
    credentials: this.credentials,
    scopes: 'https://www.googleapis.com/auth/wallet_object.issuer',
  });

  /**
   * Generates a Google Pass Class on the Google Event Pass API, defining the
   * generic pass parameters before validating to see if the class is active
   *
   * Accepts pass class if the HTTP request does not return an error
   * Does return an error if the class is pre-defined or an unknown error occurs
   */
  async createPassClass() {
    // Creates a Generic pass class
    let genericClass = {
      id: `${this.classId}`,
      classTemplateInfo: {
        cardTemplateOverride: {
          cardRowTemplateInfos: [
            {
              twoItems: {
                startItem: {
                  firstValue: {
                    fields: [
                      {
                        fieldPath: 'object.textModulesData["points"]',
                      },
                    ],
                  },
                },
                endItem: {
                  firstValue: {
                    fields: [
                      {
                        fieldPath: 'object.textModulesData["contacts"]',
                      },
                    ],
                  },
                },
              },
            },
          ],
        },
        detailsTemplateOverride: {
          detailsItemInfos: [
            {
              item: {
                firstValue: {
                  fields: [
                    {
                      fieldPath: 'class.imageModulesData["event_banner"]',
                    },
                  ],
                },
              },
            },
            {
              item: {
                firstValue: {
                  fields: [
                    {
                      fieldPath: 'class.textModulesData["game_overview"]',
                    },
                  ],
                },
              },
            },
            {
              item: {
                firstValue: {
                  fields: [
                    {
                      fieldPath: 'class.linksModuleData.uris["official_site"]',
                    },
                  ],
                },
              },
            },
          ],
        },
      },
      imageModulesData: [
        {
          mainImage: {
            sourceUri: {
              uri: 'https://images.squarespace-cdn.com/content/v1/5fa8e94ebfb041130bad0746/1605238318651-YMVY4FRLR6YGI5XRCY2M/RPanimation_00017.png?format=2500w',
            },
            contentDescription: {
              defaultValue: {
                language: 'en-US',
                value: 'R|P 2023 Banner',
              },
            },
          },
          id: 'event_banner',
        },
      ],
      textModulesData: [
        {
          header: 'Make connections at R|P 2023',
          body: "Attend conferences, make connections, and learn about technology at Reflections|Projections '23.",
          id: 'event_overview',
        },
      ],
      linksModuleData: {
        uris: [
          {
            uri: 'https://www.reflectionsprojections.org/',
            description: "Official R|P '23 Site",
            id: 'official_site',
          },
        ],
      },
    };

    let response;
    try {
      // Check if the class exists already, to avoid pass duplication
      response = await this.httpClient.request({
        url: `${baseUrl}/genericClass/${this.classId}`,
        method: 'GET',
      });

      console.log('Class already exists');
      console.log(response);
    } catch (err) {
      if (err.response && err.response.status === 404) {
        // 404 Error indicates the class does not exist
        // So a request is sent to create the class
        response = await this.httpClient.request({
          url: `${baseUrl}/genericClass`,
          method: 'POST',
          data: genericClass,
        });

        console.log('Class insert response');
        return response;
      } else {
        // Something else went wrong
        console.log(err);
        return 'Something went wrong...check the console logs!';
      }
    }
  }

  /**
   * Generates a Google Wallet Event Pass URL using the preexisting class
   * defined in createPassClass()
   *
   * Sets the Event Pass object parameters before encrypting the data as a JWT
   * and appending it to the end of a Google Pay URL to return to the user
   *
   * @param name The user name to be added to the pass
   * @param email A valid email address
   * @returns Google Wallet Event Pass URL to be added to the frontend
   */
  async createPassObject(email, name) {
    // Creates a new Generic pass for the user-specifically
    let objectSuffix = `${email.replace(/[^\w.-]/g, '_')}`;
    let objectId = `${this.issuerId}.${objectSuffix}`;

    let genericObject = {
      id: `${objectId}`,
      classId: this.classId,
      genericType: 'GENERIC_TYPE_UNSPECIFIED',
      hexBackgroundColor: '#f44285',
      logo: {
        sourceUri: {
          uri: 'https://media.licdn.com/dms/image/C560BAQFNRv6thlDIzA/company-logo_200_200/0/1651164180042?e=2147483647&v=beta&t=guziuskz3q2ZGqGl8QXfP7-1IHr6m1-FK_aq4p23skg',
        },
      },
      cardTitle: {
        defaultValue: {
          language: 'en',
          value: 'Reflections|Projections 2023',
        },
      },
      subheader: {
        defaultValue: {
          language: 'en',
          value: 'Attendee',
        },
      },
      header: {
        defaultValue: {
          language: 'en',
          value: `${name}`,
        },
      },
      barcode: {
        type: 'QR_CODE',
        //TODO: LINK value parameter with User encoding function
        value: `${name}`,
      },
      heroImage: {
        sourceUri: {
          uri: 'https://images.squarespace-cdn.com/content/v1/5fa8e94ebfb041130bad0746/1605238318651-YMVY4FRLR6YGI5XRCY2M/RPanimation_00017.png?format=2500w',
        },
      },
      textModulesData: [
        {
          header: 'PASS TYPE',
          body: 'attendee',
          id: 'contacts',
        },
      ],
    };

    // Creates the signed JWT and link
    const claims = {
      iss: this.credentials.client_email,
      aud: 'google',
      origins: [],
      typ: 'savetowallet',
      payload: {
        genericObjects: [genericObject],
      },
    };
    //Parses the private key environment string for the private key format
    const pKey = process.env.GOOGLE_PRIV_KEY.split(String.raw`\n`).join('\n');
    //Signs the pass parameters and credentials as a RS 256 encrypted JWT
    const token = jwt.sign(claims, pKey, { algorithm: 'RS256' });
    const saveUrl = `https://pay.google.com/gp/v/save/${token}`;
    //returns direct URL to the Google Wallet Pass addition page
    return saveUrl;
  }

  async getGooglePass(email: string, name: string) {
    await this.createPassClass();
    return await this.createPassObject(email, name);
  }

  getLoggedInUser() {}
}
