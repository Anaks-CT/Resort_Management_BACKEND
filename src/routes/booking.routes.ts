import express from "express";
import { bookingConfirmationPart1 } from "../controllers/booking/booking";



export const booking = express.Router();

booking.post("/confirmPart1", bookingConfirmationPart1);