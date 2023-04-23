import { UpdateQuery, UpdateWriteOpResult } from "mongoose";
import { ICompany } from "../interface/company.interface";
import companyModel from "../models/company.model";
import { BaseRepository } from "./baseRepositary";
import { ObjectId } from "mongodb";


class BookingRepositary extends BaseRepository {
    constructor() {
        super(companyModel);
    }


    async addFaqs(Q: string, A: string): Promise<ICompany | null> {
        return await companyModel.findOneAndUpdate(
            {},
            { $addToSet: { faqs: { Q: Q, A: A } } },
            { new: true }
        );
    }

}

export default BookingRepositary;
