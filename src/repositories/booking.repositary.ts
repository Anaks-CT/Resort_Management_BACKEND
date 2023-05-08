import { UpdateQuery, UpdateWriteOpResult } from "mongoose";
import { ICompany } from "../interface/company.interface";
import { BaseRepository } from "./baseRepositary";
import { ObjectId } from "mongodb";
import bookingModel from "../models/booking.model";
import { IBooking } from "../interface/booking.interface";

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

    async cancelbookingStatus(bookingId: string){
        return await bookingModel.updateOne(
            { _id: bookingId },
            {
                $set: {
                    status: false
                }
            }
        )
    }

    async searchSortService(searchValue: string, sortOrder: 1 | -1 | null, sortBy: string | null): Promise<IBooking[]>{
        //************************************ major error will change later */
        let query = bookingModel.find({"resortDetails.name": { $regex : new RegExp(searchValue ? searchValue : '', 'i')}}).populate('manager');
        if (sortOrder && sortBy) query = query.sort({[sortBy]: sortOrder});
        
        return await query;
    }
}

export default BookingRepositary;
