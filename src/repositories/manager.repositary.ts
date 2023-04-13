import { UpdateWriteOpResult } from "mongoose";
import ErrorResponse from "../error/errorResponse";
import { IUser } from "../interface/user.interface";
import managerModel from "../models/manager.model";
import UserSchema from "../models/user.model";
import { BaseRepository } from "./baseRepositary";
import { IGallary } from "../interface/gallary.interface";
import { IManager } from "../interface/manager.interface";

class MangerRepositary extends BaseRepository{
  constructor(){
    super(managerModel)
  }
  
  async blockingAllExistingMangerOfResort (resortId: string):Promise<UpdateWriteOpResult> {
    return await managerModel.updateMany({resortId: resortId}, {$set: {active: false}})
  }

  async updateManagerStatus (resortId: string, email: string): Promise<UpdateWriteOpResult> {
    return await managerModel.updateOne({resortId: resortId, email: email},[{ $set: { active: { $not: ["$active"] } } }])
  }

  // async getPopulatedResortDetails(): Promise<IManager[] | null >{
  //   return await managerModel.find().populate('resortId')
  // }
  async searchSortManagerDetails(searchValue: string, sortOrder: 1 | -1 | null, sortBy: string): Promise<any>{
    //************************************ major error will change later */
    let query = managerModel.find({"email": { $regex : new RegExp(searchValue ? searchValue : '', 'i')}}).populate('resortId');
    if (sortOrder) {
        query = query.sort({[sortBy]: sortOrder});
    }
    return await query;
}
}

export default MangerRepositary;
