import ErrorResponse from "../error/errorResponse";
import BookingRepositary from "../repositories/booking.repositary";



export default class BookingService {
    constructor(private bookingRepositary = new BookingRepositary()) {}

    // async createCompany(
    //     companyName: string,
    //     bannerDetails: bannerDetails,
    //     circleBanners: circleBanner[],
    //     faqs: faqs[]
    // ): Promise<ICompany> {
    //     const company = {
    //         companyName: companyName,
    //         bannerDetails: bannerDetails,
    //         circleBanners: circleBanners,
    //         faqs: faqs,
    //     };
    //     const addCompany = await this.companyRepositary.create<ICompany>(company)
    //     return addCompany
    // }

    // async getA(): Promise<ICompany>{
    //     const companyDetails = await this.companyRepositary.getOne<ICompany>({})
    //     if(!companyDetails)
    //         throw ErrorResponse.internalError('company not found')
    //     return companyDetails
    // }

}
