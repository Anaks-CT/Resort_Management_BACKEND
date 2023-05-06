import mongoose, { model, Schema } from "mongoose";
import { IBooking } from "../interface/booking.interface";

const bookingSchema = new Schema<IBooking>({
    userId: {type: String, required: true, ref:"User"},
    resortId: {type: String, required: true, ref: "Resort"},
    BookingDate: {type: Date, default: new Date()},
    checkInDate: {type: Date, required: true},
    checkOutDate: {type: Date, required: true},
    roomDetail: [
        {
            roomTypeId: {type: mongoose.Types.ObjectId, required: true},
            roomName: {type: String, required: true},
            roomNumber: {type: String, required: true},
            roomId: {type: mongoose.Types.ObjectId, required: true},
            packagename: {type: String, required: true},
            packageCost: {type: Number, required: true}
        }
    ],
    amount: {
        totalRoomCost: {type: Number, required: true},
        taxCost: {type: Number, required: true},
        pointsUsed: {type: Number, required: true},
        totalCost: {type: Number, required: true},
    },
    status: {type: Boolean, default: true},
    paymentSuccess: {type: Boolean, default: false}
},{timestamps: true});

export default model<IBooking>("Booking", bookingSchema);
