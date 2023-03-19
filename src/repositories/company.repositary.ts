import { ICompany } from "../interface/company.interface";
import companyModel from "../models/company.model";


type bannerDetails = {
    image: string,
    description: string
}
type faqs = {
    Q: string
    A: string
}

class CompanyRepositary {
  async createCompany(
    companyName: string,
    bannerDetails: bannerDetails,
    faqs: faqs[]

  ): Promise<ICompany> {
    const company = new companyModel({
        companyName: companyName,
        bannerDetails: bannerDetails,
        faqs: faqs
    });
    await company.save();
    return company.toJSON() as ICompany;
  }

  async getCompanyDetails(): Promise<ICompany | null>{
    const company = await companyModel.findOne()
    return company ? company.toJSON() as ICompany : null
  }

}

export default CompanyRepositary;
