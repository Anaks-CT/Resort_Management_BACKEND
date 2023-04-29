"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.booking = void 0;
const express_1 = __importDefault(require("express"));
const booking_1 = require("../controllers/booking/booking");
exports.booking = express_1.default.Router();
exports.booking.post("/confirmPart1", booking_1.bookingConfirmationPart1);
