import { UpdateQuery, UpdateWriteOpResult } from "mongoose";
import { ICompany } from "../interface/company.interface";
import { BaseRepository } from "./baseRepositary";
import { ObjectId } from "mongodb";
import bookingModel from "../models/booking.model";

class BookingRepositary extends BaseRepository {
    constructor() {
        super(bookingModel);
    }

    async updateBookingPayment(bookingId: string) {
        return await bookingModel.updateOne(
            { _id: new ObjectId(bookingId) },
            {
                $set: {
                    paymentSuccess: true,
                },
            }
        );
    }
}

export default BookingRepositary;
