import { UpdateQuery } from "mongoose";
import ErrorResponse from "../error/errorResponse";
import { circleBanner, ICompany } from "../interface/company.interface";
import companyModel from "../models/company.model";
import { BaseRepository } from "./baseRepositary";
import { ObjectId } from "mongodb";

type bannerDetails = {
    image: string;
    description: string;
};
type faqs = {
    Q: string;
    A: string;
};

class CompanyRepositary extends BaseRepository {
    constructor() {
        super(companyModel);
    }
    async createCompany(company: ICompany): Promise<ICompany> {
        return this.create(company);
    }

    async getCompanyDetails(): Promise<ICompany | null> {
        return await this.getOne();
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
        const updateResortIdResponse: UpdateQuery<any> =
            await companyModel.updateOne(
                {},
                { $addToSet: { resortDetails: resortId } }
            );
        return updateResortIdResponse.acknowledged;
    }
}

export default CompanyRepositary;
