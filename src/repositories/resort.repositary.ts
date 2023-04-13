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

    // async createResort(resortDetails: IResort): Promise<IResort> {
    //     return await this.create<IResort>(resortDetails);
    // }

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

    // pushing new room that is being created
    async addingRoomInResort(roomId: string, resortId: string): Promise<UpdateWriteOpResult> {
        return await resortModel.updateOne({_id: resortId},{$push: {rooms: roomId}})
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

    async addManger(resortId: string, managerId: string): Promise<UpdateWriteOpResult>{
        return await resortModel.updateOne({_id: resortId}, {$set : {manager: managerId}})
    }

    async deleteManager(resortId: string): Promise<UpdateWriteOpResult>{
        return await resortModel.updateOne({_id: resortId},{$unset: {manager: ''}})
    }

    async searchSortService(searchValue: string, sortOrder: 1 | -1 | null): Promise<IResort[]>{
        //************************************ major error will change later */
        let query = resortModel.find({"resortDetails.name": { $regex : new RegExp(searchValue ? searchValue : '', 'i')}}).populate('manager');
        if (sortOrder) {
            query = query.sort({"resortDetails.name": sortOrder});
        }
        return await query;
    }
}

export default ResortRepositary;
