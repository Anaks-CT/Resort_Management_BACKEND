import express from "express";
import {
    bookingConfirmationPart1,
    cancelBooking,
    getBookingDetailsOfUser,
    getResortBookings,
    searchSortedBookingDetails,
    verifyPayment,
} from "../controllers/booking/bookingCRUD";
import { adminOrMangerVerify, adminVerify, userVerify } from "../middlewares/auth-middlewares";
import {
    bookingRoomDetailsValidate,
    paramsIdValidate,
} from "../middlewares/bodyValidation";

export const booking = express.Router();

booking
    .route("/")
    .post(userVerify, bookingRoomDetailsValidate, bookingConfirmationPart1)
    .patch(verifyPayment)
    .get(userVerify, getBookingDetailsOfUser);

booking.delete("/:id", userVerify, paramsIdValidate, cancelBooking);

booking
    .route("/resortBookingDetails/:id")
    .get(adminOrMangerVerify, paramsIdValidate, getResortBookings)
    .post(adminOrMangerVerify, paramsIdValidate, searchSortedBookingDetails)

