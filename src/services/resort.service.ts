import ResortRepositary from "../repositories/resort.repositary";
import {
    CreateResortResponse,
    IResort,
    IResortDetail,
} from "../interface/resort.interface";
import ErrorResponse from "../error/errorResponse";
import GallaryRepositary from "../repositories/gallary.repositary";
import CompanyRepositary from "../repositories/company.repositary";
import { UpdateWriteOpResult } from "mongoose";

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
        const resortDupe = await this.resortRepositary.getOne<IResort>({resortDetails: resortDetails});
            

        /////////////////////// checking duplicate resort with same name///////////////////////////////

        if (resortDupe) {
            throw ErrorResponse.badRequest("Resort aldready exists");
        }

        //////////////////////// creating new resort ////////////////////////
        const newResort = {
            resortDetails: {
                name: resortDetails.name,
                heading: resortDetails.heading,
                description: resortDetails.description,
                image: resortDetails.image,
                features: resortDetails.features,
            },
            location: location,
            email: email,
            customerCareNo: customerCareNo,
        }
        const resort = await this.resortRepositary.create<any>(newResort);

        ///////////////////////// adding the newly created resort in to company  /////////////////

        await this.companyRepositary.addResortId(resort._id)

        ///////////////////////// creating gallary modal for the resort //////////////////////

        const gallary = await this.gallaryRepositary.createGallary(resort._id);

        if (!gallary)
            throw ErrorResponse.internalError(
                "gallary is not created. Error occured in the database"
            );

        ////////////////////////// updating the created gallaryid in resort schema/////////////////////

        await this.resortRepositary.setGallaryId(resort._id!, gallary._id!);

        return { resort };
    }

    async getActiveMangerOfResort(resortId: string){
        const populatedResortDetails = this.resortRepositary.populatedResortDetailsOfManager(resortId)
        if(!populatedResortDetails) throw ErrorResponse.notFound('No Resort details')
        return populatedResortDetails
    }

    async editResort(resortDetails:IResort, image: string, resortId: string ): Promise<UpdateWriteOpResult | null>{
        const editResort = await this.resortRepositary.editResort(resortDetails, resortId, image )
        if(editResort?.modifiedCount !== 1) throw ErrorResponse.internalError('Resort not edited')
        return editResort
    }

    async editResortActive(resortId: string): Promise<UpdateWriteOpResult>{
        const editResponse = await this.resortRepositary.editResortActive(resortId)
        const editGallaryStatus = await this.gallaryRepositary.editGallaryStatus(resortId)
        if(editResponse.modifiedCount !== 1 || editGallaryStatus.modifiedCount !== 1) throw ErrorResponse.internalError('Resort Active is not changed')
        return editResponse
    }

    async allResortDetails(): Promise<IResort[] | null> {
        const resort = await this.resortRepositary.getAll<IResort>({});
        if (resort.length < 1) throw ErrorResponse.badRequest("Resorts not found");
        return resort;
    }

    async searchSortService(searchValue: string, sortOrder: string): Promise<IResort[] | null>{
                
        let order: 1 | -1 | null
        if(sortOrder === "asc"){
            order = 1
        }else if(sortOrder === "des"){
            order = -1
        }else{
            order = null
        }
        const resortDetails = await this.resortRepositary.searchSortService(searchValue, order)
        if(!resortDetails) throw ErrorResponse.internalError('Resorts not found')
        return resortDetails as IResort[]
    }  

    async getResortCount() {
        return await this.resortRepositary.count()
    }

    async getResortById(id: string): Promise<IResort>{
        const resort = await this.resortRepositary.getById<IResort>(id)
        if(!resort) throw ErrorResponse.badRequest("Resort not found")
        return resort
    }

    async getResortByManagerId(managerId: string){
        const resortDetails = await this.resortRepositary.getResortByManagerId(managerId)
        if(!resortDetails) throw ErrorResponse.notFound('Resort Not Found')
        return resortDetails
    }
}
