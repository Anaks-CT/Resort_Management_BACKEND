import { UpdateQuery, UpdateWriteOpResult } from "mongoose";
import { ICompany } from "../interface/company.interface";
import companyModel from "../models/company.model";
import { BaseRepository } from "./baseRepositary";
import { ObjectId } from "mongodb";

type faqs = {
    Q: string;
    A: string;
};

class CompanyRepositary extends BaseRepository {
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

    async deleteFaq(id: string): Promise<ICompany | null> {
        return await companyModel.findOneAndUpdate(
            {},
            {
                $pull: {
                    faqs: {
                        _id: new ObjectId(id),
                    },
                },
            },
            { new: true }
        );
    }

    async editFaq(
        id: string,
        question: string,
        answer: string
    ): Promise<ICompany | null> {
        return await companyModel.findOneAndUpdate(
            { "faqs._id": id },
            { $set: { "faqs.$.Q": question, "faqs.$.A": answer } },
            {new: true}
        );
    }

    async searchSingleFaq(faqs: faqs): Promise<ICompany | null> {
        return await companyModel
            .findOne({ faqs: { $elemMatch: { Q: faqs.Q } } })
            .exec();
    }

    async searchFaqById(faqID: string): Promise<ICompany | null> {
        return await companyModel.findOne({ "faqs._id": faqID });
    }

    async addResortId(resortId: string): Promise<boolean | null> {
        const updateResortIdResponse: UpdateQuery<UpdateWriteOpResult> =
            await companyModel.updateOne(
                {},
                { $addToSet: { resortDetails: resortId } }
            );
        return updateResortIdResponse.acknowledged;
    }
}

export default CompanyRepositary;
