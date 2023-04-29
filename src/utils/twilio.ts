import twilio from "twilio";
import dotenv from "dotenv";

dotenv.config();

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID!;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN!;
const TWILIO_SERVICE_ID = process.env.TWILIO_SERVICE_ID!;

const client = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);

export const sendVerificationToken = (phoneNumber: string): Promise<boolean> => {
  return new Promise((resolve) => {
    client.verify
      .v2.services(TWILIO_SERVICE_ID)
      .verifications.create({
        to: `+91${phoneNumber}`,
        channel: "sms",
      }) 
      .then((data: any) => {
        resolve(true);
      })
      .catch((error: any) => {
        console.log(error)
        resolve(false);
      });
  });
};

export const checkVerificationToken = (otp: string, phoneNumber: string): Promise<boolean> => {
  return new Promise((resolve) => {
    client.verify
      .v2.services(TWILIO_SERVICE_ID)
      .verificationChecks.create({
        to: `+91${phoneNumber}`,
        code: otp,
      })
      .then((data: any) => {
        if (data.valid) {
          resolve(true);
        } else {
          resolve(false);
        }
      })
      .catch((error: any) => {
        console.log(error);
        resolve(false);
      });
  });
};
