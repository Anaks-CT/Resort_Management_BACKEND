import mongoose from "mongoose";
import ErrorResponse from "../error/errorResponse";
import { circleBanner, ICompany, Ifaq } from "../interface/company.interface";
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
        const company = {
            companyName: companyName,
            bannerDetails: bannerDetails,
            circleBanners: circleBanners,
            faqs: faqs,
        };
        const addCompany = await this.companyRepositary.createCompany(company)
        return addCompany
    }

    async getCompanyDetails(): Promise<ICompany>{
        const companyDetails = await this.companyRepositary.getCompanyDetails()
        if(!companyDetails)
            throw ErrorResponse.internalError('company not found')
        return companyDetails
    }

    async getfaqDetails(): Promise<Ifaq[]>{
        const companyDetails = await this.companyRepositary.getOne<ICompany>()
        if(!companyDetails) throw ErrorResponse.internalError('company not found')
        return companyDetails?.faqs
    }

    async addFaq(Q: string, A: string): Promise<Ifaq[]>{
        // checking if the faq is more than 10
        const company = await this.companyRepositary.getOne<ICompany>()
        if(company?.faqs.length === 10) throw ErrorResponse.forbidden('Cannot add more than 10 FAQs')
        //// checking for image duplication
        const checkFaqDup = await this.companyRepositary.searchSingleFaq({Q, A})
        if(checkFaqDup) throw ErrorResponse.badRequest('FAQ aldready exist')
        const companyDetail = await this.companyRepositary.addFaqs(Q, A)
        if(!companyDetail) throw ErrorResponse.internalError('FAQ not added')
        return companyDetail.faqs
    }

    async editFaq(id: string, question: string, answer: string): Promise<Ifaq[] | null>{
        const response = await this.companyRepositary.editFaq(id, question, answer)
        if(!response) throw ErrorResponse.badRequest('FAQ is not edited')
        return response.faqs
    }

    async deleteFaq(id: string): Promise<Ifaq[]>{
        // checking if the faqID is present in the company
        const faqTest = await this.companyRepositary.searchFaqById(id)
        if(!faqTest) throw ErrorResponse.badRequest('No faq with the given Id')
        const response = await this.companyRepositary.deleteFaq(id)
        if(!response) throw ErrorResponse.internalError('Faq not deleted')
        return response.faqs        
    }
}
