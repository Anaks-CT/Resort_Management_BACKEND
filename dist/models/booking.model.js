"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const bookingSchema = new mongoose_1.Schema({
    userId: { type: String, required: true },
    resortId: { type: String, required: true },
    BookingDate: { type: Date, default: new Date() },
    checkInDate: { type: Date, required: true },
    checkOutDate: { type: Date, required: true },
    roomDetail: [
        {
            roomType: { type: String, required: true },
            roomNumber: { type: Number, required: true },
            noOfGuests: { type: Number, required: true }
        }
    ],
    amount: {
        roomCost: { type: Number, required: true },
        taxCost: { type: Number, required: true },
        pointsUsed: { type: Number, required: true },
        totalCost: { type: Number, required: true },
    },
    status: { type: Boolean, default: true }
});
exports.default = (0, mongoose_1.model)("Booking", bookingSchema);
