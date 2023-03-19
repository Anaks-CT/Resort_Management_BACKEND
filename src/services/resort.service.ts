import ResortRepositary from "../repositories/resort.repositary";
import {
    CreateResortResponse,
    IResortDetail,
} from "../interface/resort.interface";
import ErrorResponse from "../error/errorResponse";
import resortGallaryModel from "../models/resortGallary.model";

export default class ResortService {
    constructor(private resortRepositary = new ResortRepositary()) {}

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

        ///////////////////////// creating gallary modal for the resort //////////////////////

        const gallary = new resortGallaryModel({
            resortid: resort._id,
        });

        ////////////////////////// updating the created gallaryid in resort schema/////////////////////

        await this.resortRepositary.setGallaryId(resort._id, gallary._id);
        await gallary.save();

        return { resort };
    }

    async allResortDetails(): Promise<IResort[] | null> {
        const resort = await this.resortRepositary.getAllresortDetails();
        if (!resort) {
            throw ErrorResponse.badRequest("Resorts not found");
        }
        return resort
    }
}
