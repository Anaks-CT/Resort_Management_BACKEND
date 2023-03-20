import mongoose from "mongoose";
import ErrorResponse from "../error/errorResponse";
import { circleBanner, ICompany } from "../interface/company.interface";
import CompanyRepositary from "../repositories/company.repositary";

type bannerDetails = {
    image: string,
    description: string
}
type faqs = {
    Q: string
    A: string
}

export default class CompanyService {
    constructor(private companyRepositary = new CompanyRepositary()) {}

    async createCompany(
        companyName: string,
        bannerDetails: bannerDetails,
        circleBanners: circleBanner[],
        faqs: faqs[]
    ): Promise<ICompany> {
        const addCompany = await this.companyRepositary.createCompany(companyName, bannerDetails,circleBanners, faqs)
        return addCompany
    }

    async getCompanyDetails(): Promise<ICompany>{
        const companyDetails = await this.companyRepositary.getCompanyDetails()
        if(!companyDetails)
            throw ErrorResponse.internalError('company not found')
        return companyDetails
    }

    async addFaq(Q: string, A: string): Promise<Boolean>{
        //// checking for image duplication
        const checkFaqDup = await this.companyRepositary.searchSingleFaq({Q, A})
        if(checkFaqDup)
            throw ErrorResponse.internalError('faq aldready exist')
        const addFaq = await this.companyRepositary.addFaqs(Q, A)
        return addFaq
    }
}
