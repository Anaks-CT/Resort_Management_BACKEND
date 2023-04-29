"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkVerificationToken = exports.sendVerificationToken = void 0;
const twilio_1 = __importDefault(require("twilio"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID;
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN;
const TWILIO_SERVICE_ID = process.env.TWILIO_SERVICE_ID;
const client = (0, twilio_1.default)(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
const sendVerificationToken = (phoneNumber) => {
    return new Promise((resolve) => {
        client.verify
            .v2.services(TWILIO_SERVICE_ID)
            .verifications.create({
            to: `+91${phoneNumber}`,
            channel: "sms",
        })
            .then((data) => {
            resolve(true);
        })
            .catch((error) => {
            console.log(error);
            resolve(false);
        });
    });
};
exports.sendVerificationToken = sendVerificationToken;
const checkVerificationToken = (otp, phoneNumber) => {
    return new Promise((resolve) => {
        client.verify
            .v2.services(TWILIO_SERVICE_ID)
            .verificationChecks.create({
            to: `+91${phoneNumber}`,
            code: otp,
        })
            .then((data) => {
            if (data.valid) {
                resolve(true);
            }
            else {
                resolve(false);
            }
        })
            .catch((error) => {
            console.log(error);
            resolve(false);
        });
    });
};
exports.checkVerificationToken = checkVerificationToken;
