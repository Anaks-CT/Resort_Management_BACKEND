import mongoose, { isObjectIdOrHexString, isValidObjectId } from "mongoose";
import { IResort, IResortDetail } from "../interface/resort.interface";
import resortModel from "../models/resort.model";

class ResortRepositary {
  async createResort(
    resortDetails: IResortDetail,
    location: string,
    email: string,
    customerCareNo: number
  ): Promise<IResort> {
    const resort = new resortModel({
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
    });
    await resort.save();
    
    return resort.toJSON() as IResort;
  }

  async getAllresortDetails():Promise<IResort[]  | null>{
    const resort = await resortModel.find()
    return resort ? resort as IResort[] : null
  }

  async searchResort(resortdetail: IResortDetail): Promise<IResort | null>{
    const resort = await resortModel.findOne({resortDetails: resortdetail})
    return resort ? resort.toJSON() as IResort : null
  }

  async findResortById(id: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId>): Promise<IResort | null>{
    const resort = await resortModel.findById(id)
    return resort ? resort.toJSON() as IResort : null
  } 

  async setGallaryId(resortId: string,gallaryId: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId>){
    const gallaryid = gallaryId.valueOf().toString()
    const resort = await resortModel.updateOne({_id: resortId},{$set: {gallaryId: gallaryid}})
    return resort ? resort.acknowledged : null
  }
}

export default ResortRepositary;
