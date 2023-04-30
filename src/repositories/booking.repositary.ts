import { UpdateQuery, UpdateWriteOpResult } from "mongoose";
import { ICompany } from "../interface/company.interface";
import { BaseRepository } from "./baseRepositary";
import { ObjectId } from "mongodb";
import bookingModel from "../models/booking.model";


class BookingRepositary extends BaseRepository {
    constructor() {
        super(bookingModel);
    }


    // async newBooking(): Promise<ICompany | null> {
    //     return await companyModel.findOneAndUpdate(
    //         {},
    //         { $addToSet: { faqs: { Q: Q, A: A } } },
    //         { new: true }
    //     );
    // }

}

export default BookingRepositary;
