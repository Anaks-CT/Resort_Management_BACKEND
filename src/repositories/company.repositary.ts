import { UpdateQuery } from "mongoose";
import ErrorResponse from "../error/errorResponse";
import { circleBanner, ICompany } from "../interface/company.interface";
import companyModel from "../models/company.model";

type bannerDetails = {
    image: string;
    description: string;
};
type faqs = {
    Q: string;
    A: string;
};

class CompanyRepositary {
    async createCompany(
        companyName: string,
        bannerDetails: bannerDetails,
        circleBanners: circleBanner[],
        faqs: faqs[]
    ): Promise<ICompany> {
        const company = new companyModel({
            companyName: companyName,
            bannerDetails: bannerDetails,
            circleBanners: circleBanners,
            faqs: faqs,
        });
        await company.save();
        return company.toJSON() as ICompany;
    }

    async getCompanyDetails(): Promise<ICompany | null> {
        const company = await companyModel.findOne();
        return company ? (company.toJSON() as ICompany) : null;
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

    async addResortId(resortId: string): Promise<Boolean | null> {
        const updateResortIdResponse: UpdateQuery<any> =
            await companyModel.updateOne(
                {},
                { $addToSet: { resortDetails: resortId } }
            );
        return updateResortIdResponse.acknowledged;
    }
}

export default CompanyRepositary;
