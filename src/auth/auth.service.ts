import { HttpStatus, Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { EmailService } from 'src/email/email.service';
import { Verification } from './verifications.schema';
import { ServiceResponse } from 'src/misc-types';
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const dayjs = require('dayjs');
const { GoogleAuth } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const baseUrl = 'https://walletobjects.googleapis.com/walletobjects/v1';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly issuerId = process.env.GOOGLE_ISSUER_ID;
  private readonly classId = `${this.issuerId}.codelab_class`;
  //Defining the credentials JSON used to validate the Google Pass Provider
  private readonly credentials = {
    "type": "service_account",
    "project_id": "qrp-test",
    "private_key_id": `${process.env.GOOGLE_PRIV_KEY_ID}`,
    "private_key": `${process.env.GOOGLE_PRIV_KEY}`,
    "client_email": `${process.env.GOOGLE_CLIENT_EMAIL}`,
    "client_id": `${process.env.GOOGLE_CLIENT_ID}`,
    "auth_uri": "https://accounts.google.com/o/oauth2/auth",
    "token_uri": "https://oauth2.googleapis.com/token",
    "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
    "client_x509_cert_url": `${process.env.GOOGLE_CLIENT_509_CERT_URL}`,
    "universe_domain": "googleapis.com"
  };
  private readonly httpClient = new GoogleAuth({
    credentials: this.credentials,
    scopes: 'https://www.googleapis.com/auth/wallet_object.issuer'
  });

  SALT_ROUNDS = 10;
  PASSCODE_LIFESPAN_MIN = 10;
  ATTEMPTS_ALLOWED = 5;
  COOLDOWN_SECONDS = 60;

  constructor(
    @InjectModel(Verification.name)
    private verificationModel: Model<Verification>,
    private emailService: EmailService,
  ) {}

  /**
   * Generates a secure 6 digit one time passcode, stores an encrypted copy in DB, and sends it to the provided email.
   *
   * Rejects if a code has already been sent in the last 30 seconds.
   * Does NOT Reject if email does not belong to registered user.
   * @param email A valid email address
   * @returns ServiceResponse object containing HTTP status code and message
   */
  async generateVerificationPasscode(email: string): Promise<ServiceResponse> {
    // Reject if passcode has been generated within the last 60 seconds
    const existing = await this.verificationModel.findOne({ email });
    let emailsSent = 0;

    if (existing) {
      const createdAt = dayjs(existing.createdAt);
      const now = dayjs();
      const ageInSeconds = now.diff(createdAt, 's');
      emailsSent = existing.emailsSent;

      if (ageInSeconds < 2 ** (emailsSent - 1) * this.COOLDOWN_SECONDS) {
        return {
          status: HttpStatus.TOO_MANY_REQUESTS,
          message:
            'A one-time code was recently sent to this email. Try again later.',
        };
      }
    }

    // Delete any old verification instances for this email
    await this.verificationModel.deleteMany({ email });

    // Create a secure six digit passcode
    const passcode = crypto.randomInt(100000, 999999).toString();

    const hash = await bcrypt.hash(passcode, this.SALT_ROUNDS);

    const result = await this.verificationModel.create({
      email,
      passcodeHash: hash,
      expiresAt: dayjs().add(this.PASSCODE_LIFESPAN_MIN, 'm').toISOString(),
      createdAt: dayjs().toISOString(),
      remainingAttempts: this.ATTEMPTS_ALLOWED,
      emailsSent: ++emailsSent,
    });

    if (!result) {
      return {
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        message: 'Could not create Verification Instance',
      };
    }

    await this.emailService.sendBasicEmail({
      to: email,
      subject: `${passcode} is your R|P code`,
      text: `Your one-time code is ${passcode}. This is valid for the next 10 minutes.`,
    });

    this.logger.log('Successfully sent verification email');
    return { status: HttpStatus.OK, message: 'Success' };
  }

  /**
   * Given an email and passcode, verifies if the passcode is correct.
   * Decrements the number of tries left for each unsuccessful attempt
   *
   * @param email A valid email address
   * @param passcode A 6 digit number string
   * @returns ServiceResponse object containing HTTP status code and message
   */
  async verifyPasscode(
    email: string,
    passcode: string,
  ): Promise<ServiceResponse> {
    const verifyInstance = await this.verificationModel.findOne({ email });

    if (!verifyInstance || verifyInstance.remainingAttempts == 0) {
      return {
        status: HttpStatus.NOT_FOUND,
        message: 'No valid one-time codes exist for this email address',
      };
    }

    const expiresAt = dayjs(verifyInstance.expiresAt);
    const isValid = dayjs().isBefore(expiresAt);

    if (!isValid) {
      const response = await this.verificationModel.deleteOne({ email });
      if (response.deletedCount == 1) {
        return {
          status: HttpStatus.GONE,
          message: 'This passcode has expired. Try generating a new code.',
        };
      } else {
        throw new Error('Database delete failed on /auth/verify');
      }
    }

    const match = await bcrypt.compare(passcode, verifyInstance.passcodeHash);

    if (!match) {
      await this.verificationModel.updateOne(
        { email },
        { $inc: { remainingAttempts: -1 } },
      );

      return {
        status: HttpStatus.UNAUTHORIZED,
        message: 'This passcode is incorrect',
      };
    } else {
      const response = await this.verificationModel.deleteOne({ email });
      if (response.deletedCount == 1) {
        return { status: HttpStatus.OK, message: 'Successfully verified!' };
      }
    }
  }

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
      'id': `${this.classId}`,
      'classTemplateInfo': {
        'cardTemplateOverride': {
          'cardRowTemplateInfos': [
            {
              'twoItems': {
                'startItem': {
                  'firstValue': {
                    'fields': [
                      {
                        'fieldPath': 'object.textModulesData["points"]'
                      }
                    ]
                  }
                },
                'endItem': {
                  'firstValue': {
                    'fields': [
                      {
                        'fieldPath': 'object.textModulesData["contacts"]'
                      }
                    ]
                  }
                }
              }
            }
          ]
        },
        'detailsTemplateOverride': {
          'detailsItemInfos': [
            {
              'item': {
                'firstValue': {
                  'fields': [
                    {
                      'fieldPath': 'class.imageModulesData["event_banner"]'
                    }
                  ]
                }
              }
            },
            {
              'item': {
                'firstValue': {
                  'fields': [
                    {
                      'fieldPath': 'class.textModulesData["game_overview"]'
                    }
                  ]
                }
              }
            },
            {
              'item': {
                'firstValue': {
                  'fields': [
                    {
                      'fieldPath': 'class.linksModuleData.uris["official_site"]'
                    }
                  ]
                }
              }
            }
          ]
        }
      },
      'imageModulesData': [
        {
          'mainImage': {
            'sourceUri': {
              'uri': 'https://images.squarespace-cdn.com/content/v1/5fa8e94ebfb041130bad0746/1605238318651-YMVY4FRLR6YGI5XRCY2M/RPanimation_00017.png?format=2500w'
            },
            'contentDescription': {
              'defaultValue': {
                'language': 'en-US',
                'value': 'R|P 2023 Banner'
              }
            }
          },
          'id': 'event_banner'
        }
      ],
      'textModulesData': [
        {
          'header': 'Make connections at R|P 2023',
          'body': 'Attend conferences, make connections, and learn about technology at Reflections|Projections \'23.',
          'id': 'event_overview'
        }
      ],
      'linksModuleData': {
        'uris': [
          {
            'uri': 'https://www.reflectionsprojections.org/',
            'description': 'Official R|P \'23 Site',
            'id': 'official_site'
          }
        ]
      }
    };
  
    let response;
    try {
      // Check if the class exists already, to avoid pass duplication
      response = await this.httpClient.request({
        url: `${baseUrl}/genericClass/${this.classId}`,
        method: 'GET'
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
          data: genericClass
        });
  
        console.log('Class insert response');
        return(response);
      } else {
        // Something else went wrong
        console.log(err);
        return('Something went wrong...check the console logs!');
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
      'id': `${objectId}`,
      'classId':this.classId,
      'genericType': 'GENERIC_TYPE_UNSPECIFIED',
      'hexBackgroundColor': '#f44285',
      'logo': {
        'sourceUri': {
          'uri': 'https://media.licdn.com/dms/image/C560BAQFNRv6thlDIzA/company-logo_200_200/0/1651164180042?e=2147483647&v=beta&t=guziuskz3q2ZGqGl8QXfP7-1IHr6m1-FK_aq4p23skg'
        }
      },
      'cardTitle': {
        'defaultValue': {
          'language': 'en',
          'value': 'Reflections|Projections 2023'
        }
      },
      'subheader': {
        'defaultValue': {
          'language': 'en',
          'value': 'Attendee'
        }
      },
      'header': {
        'defaultValue': {
          'language': 'en',
          'value': `${name}`
        }
      },
      'barcode': {
        'type': 'QR_CODE',
        //TODO: LINK value parameter with User encoding function
        'value': `${name}`
      },
      'heroImage': {
        'sourceUri': {
          'uri': 'https://images.squarespace-cdn.com/content/v1/5fa8e94ebfb041130bad0746/1605238318651-YMVY4FRLR6YGI5XRCY2M/RPanimation_00017.png?format=2500w'
        }
      },
      'textModulesData': [
        {
          'header': 'PASS TYPE',
          'body': 'attendee',
          'id': 'contacts'
        }
      ]
    };
  
    // Creates the signed JWT and link
    const claims = {
      iss: this.credentials.client_email,
      aud: 'google',
      origins: [],
      typ: 'savetowallet',
      payload: {
        genericObjects: [
          genericObject
        ]
      }
    };
    //Parses the private key environment string for the private key format
    const pKey = process.env.GOOGLE_PRIV_KEY.split(String.raw`\n`).join('\n')
    //Signs the pass parameters and credentials as a RS 256 encrypted JWT
    const token = jwt.sign(claims, pKey, { algorithm: 'RS256' });
    const saveUrl = `https://pay.google.com/gp/v/save/${token}`;
    //returns direct URL to the Google Wallet Pass addition page
    return(saveUrl);
  }

  async getGooglePass(email: string, name: string) {
    await this.createPassClass();
    return (await this.createPassObject(email, name))
  }

  getLoggedInUser() {}
}
