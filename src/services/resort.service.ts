import ResortRepositary from "../repositories/resort.repositary";
import {
    CreateResortResponse,
    IResort,
    IResortDetail,
} from "../interface/resort.interface";
import ErrorResponse from "../error/errorResponse";
import GallaryRepositary from "../repositories/gallary.repositary";
import CompanyRepositary from "../repositories/company.repositary";

export default class ResortService {
    constructor(
        private resortRepositary = new ResortRepositary(),
        private gallaryRepositary = new GallaryRepositary(),
        private companyRepositary = new CompanyRepositary()
    ) {}

    async createResort(
        resortDetails: IResortDetail,
        location: string,
        email: string,
        customerCareNo: number
    ): Promise<CreateResortResponse> {
        const resortDupe = await this.resortRepositary.searchResort(
            resortDetails
        );

        /////////////////////// checking duplicate resort with same name///////////////////////////////

        if (resortDupe) {
            throw ErrorResponse.badRequest("Resort aldready exists");
        }

        //////////////////////// creating new resort ////////////////////////

        const resort = await this.resortRepositary.createResort(
            resortDetails,
            location,
            email,
            customerCareNo
        );

        ///////////////////////// adding the newly created resort in to company  /////////////////

        await this.companyRepositary.addResortId(resort._id)

        ///////////////////////// creating gallary modal for the resort //////////////////////

        const gallary = await this.gallaryRepositary.createGallary(resort._id);

        if (!gallary)
            throw ErrorResponse.internalError(
                "gallary is not created. Error occured in the database"
            );

        ////////////////////////// updating the created gallaryid in resort schema/////////////////////

        await this.resortRepositary.setGallaryId(resort._id, gallary?._id);

        return { resort };
    }

    async allResortDetails(): Promise<IResort[] | null> {
        const resort = await this.resortRepositary.getAllresortDetails();
        if (!resort) {
            throw ErrorResponse.badRequest("Resorts not found");
        }
        return resort;
    }
}
