import mongoose, { Document } from "mongoose";



export interface ICompany extends Document {
  companyName: string;
  resortDetails?:  mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId>[]
  bannerDetails: {
    image: string,
    description: string
  }
  faqs: {
    Q: string
    A: string
  }[]
}

// export interface CreateResortResponse{
//   resort:ICompany
// }