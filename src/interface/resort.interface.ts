import mongoose, { Document } from "mongoose";

export interface IResortDetail {
  name: string;
  heading: string;
  description: string;
  image: string
  features: string[];
};

export interface IResort extends Document {
  resortDetails: IResortDetail;
  manager?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId>;
  location: string;
  email: string;
  customerCareNo: number;
  gallaryId?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId>;
}

export interface CreateResortResponse{
  resort:IResort
}