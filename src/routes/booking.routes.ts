import express from "express";
import { bookingConfirmationPart1 } from "../controllers/booking/bookingCRUD";
import { userVerify } from "../middlewares/auth-middlewares";
import { bookingRoomDetailsValidate } from "../middlewares/bodyValidation";



export const booking = express.Router();

booking.post("/confirmPart1", userVerify, bookingRoomDetailsValidate, bookingConfirmationPart1);