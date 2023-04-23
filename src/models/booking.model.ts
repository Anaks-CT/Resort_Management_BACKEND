import { model, Schema } from "mongoose";
import { IBooking } from "../interface/booking.interface";

const bookingSchema = new Schema<IBooking>({
    userId: {type: String, required: true},
    resortId: {type: String, required: true},
    BookingDate: {type: Date, default: new Date()},
    checkInDate: {type: Date, required: true},
    checkOutDate: {type: Date, required: true},
    roomDetail: [
        {
            roomType: {type: String, required: true},
            roomNumber: {type: Number, required: true},
            noOfGuests: {type: Number, required: true}
        }
    ],
    amount: {
        roomCost: {type: Number, required: true},
        taxCost: {type: Number, required: true},
        pointsUsed: {type: Number, required: true},
        totalCost: {type: Number, required: true},
    },
    status: {type: Boolean, default: true}

});

export default model<IBooking>("Booking", bookingSchema);
