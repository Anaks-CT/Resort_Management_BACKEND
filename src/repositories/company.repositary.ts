import { UpdateQuery } from "mongoose";
import ErrorResponse from "../error/errorResponse";
import { circleBanner, ICompany } from "../interface/company.interface";
import companyModel from "../models/company.model";
import { BaseRepository } from "./baseRepositary";

type bannerDetails = {
    image: string;
    description: string;
};
type faqs = {
    Q: string;
    A: string;
};

class CompanyRepositary extends BaseRepository{
    constructor(){
        super(companyModel)
    }
    async createCompany(company: ICompany): Promise<ICompany> {
        return this.create(company)
    }

    async getCompanyDetails(): Promise<ICompany | null> {
        return await this.getOne();
    }

    async addFaqs(Q: string, A: string): Promise<boolean> {
            const result: UpdateQuery<any> = await companyModel.updateOne(
                {},
                { $addToSet: { faqs: { Q: Q, A: A } } }
            );
            return result.acknowledged;
    }

    async searchSingleFaq(faqs: faqs): Promise<ICompany | null> {
        const existingFAQ = await companyModel
            .findOne({ faqs: { $elemMatch: { Q: faqs.Q } } })
            .exec();
        return existingFAQ;
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
