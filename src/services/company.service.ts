import mongoose from "mongoose";
import ErrorResponse from "../error/errorResponse";
import { ICompany } from "../interface/company.interface";
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
        faqs: faqs[]
    ): Promise<ICompany> {
        const addCompany = await this.companyRepositary.createCompany(companyName, bannerDetails, faqs)
        return addCompany
    }

    async getCompanyDetails(): Promise<ICompany>{
        const companyDetails = await this.companyRepositary.getCompanyDetails()
        if(!companyDetails)
            throw ErrorResponse.internalError('company not found')
        return companyDetails
    }
}
