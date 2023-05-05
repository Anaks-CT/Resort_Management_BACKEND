import express from "express";
import {
    bookingConfirmationPart1,
    getBookingDetailsOfUser,
    verifyPayment,
} from "../controllers/booking/bookingCRUD";
import { userVerify } from "../middlewares/auth-middlewares";
import { bookingRoomDetailsValidate } from "../middlewares/bodyValidation";

export const booking = express.Router();

booking
    .route("/")
    .post(userVerify, bookingRoomDetailsValidate, bookingConfirmationPart1)
    .patch(verifyPayment)
    .get(userVerify, getBookingDetailsOfUser);
