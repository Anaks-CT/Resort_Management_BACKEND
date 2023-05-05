"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.booking = void 0;
const express_1 = __importDefault(require("express"));
const bookingCRUD_1 = require("../controllers/booking/bookingCRUD");
const auth_middlewares_1 = require("../middlewares/auth-middlewares");
const bodyValidation_1 = require("../middlewares/bodyValidation");
exports.booking = express_1.default.Router();
exports.booking
    .route("/")
    .post(auth_middlewares_1.userVerify, bodyValidation_1.bookingRoomDetailsValidate, bookingCRUD_1.bookingConfirmationPart1)
    .patch(bookingCRUD_1.verifyPayment)
    .get(auth_middlewares_1.userVerify, bookingCRUD_1.getBookingDetailsOfUser);
