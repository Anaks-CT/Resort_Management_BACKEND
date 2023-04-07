import { UpdateWriteOpResult } from "mongoose";
import { IResort, IResortDetail } from "../interface/resort.interface";
import resortModel from "../models/resort.model";
import { BaseRepository } from "./baseRepositary";
import { ObjectId } from "mongodb";
import { stringify } from "querystring";

class ResortRepositary extends BaseRepository {
    ///////////////////////////// creating a single resort with all the information passed from front end//////////////////
    constructor() {
        super(resortModel);
    }

    async createResort(resortDetails: IResort): Promise<IResort> {
        return await this.create<IResort>(resortDetails);
    }

    async editResort(resortDetails: any, resortId: string, image: string| null): Promise<UpdateWriteOpResult> {
        return await resortModel.updateOne({_id: new ObjectId(resortId)}, {
            $set: {
                "resortDetails.name": resortDetails.name,
                "resortDetails.heading": resortDetails.heading,
                "resortDetails.description": resortDetails.description,
                ...(image ? { "resortDetails.image": image } : {}),
                "resortDetails.features": resortDetails.features,
                location: resortDetails.location,
                email: resortDetails.email,
                customerCareNo: resortDetails.customerCareNo,
            },
        });
    }

    async editResortActive(resortId: string): Promise<UpdateWriteOpResult> {
        return await resortModel.updateOne({_id: new ObjectId(resortId)},[{ $set: { active: { $not: ["$active"] } } }])
    }


    ////////////////////////////// querying for all resorts information ////////////////////////

    async getAllresortDetails(): Promise<IResort[] | null> {
        return await this.getAll<IResort>();
    }

    async resortDetailService(searchValue: string, sortBy: string | null, sortOrder: 1 | -1 | null): Promise<IResort[] | null>{
        return await this.searchSortService<IResort>(searchValue, sortBy, sortOrder)
    }

    ///////////////////////////// querying for single resort details which contains of name, heading, description, image//////
    async searchResort(resortdetail: IResortDetail): Promise<IResort | null> {
        return await resortModel.findOne({
            resortDetails: resortdetail,
        });
    }

    ////////////////////////////// querying resort by its id /////////////////////////////

    async findResortById(id: string): Promise<IResort | null> {
        return await this.getById<IResort>(id);
    }

    ////////////////////////////// updating gallary id after creating gallary model in the database////////////

    async setGallaryId(
        resortId: string,
        gallaryId: string
    ): Promise<UpdateWriteOpResult> {
        const gallaryid = gallaryId.valueOf().toString(); // doubt
        return await resortModel.updateOne(
            { _id: new ObjectId(resortId) },
            { $set: { gallaryId: gallaryid } }
        );
    }
}

export default ResortRepositary;
