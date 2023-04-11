import {ObjectId} from "mongodb"


export interface IResortDetail {
  name: string;
  heading: string;
  description: string;
  image: string
  features: string[];
}

export interface IResort {
  _id: string
  resortDetails: IResortDetail;
  manager?: ObjectId;
  rooms: string[]
  location: string;
  email: string;
  customerCareNo: number;
  gallaryId?: ObjectId;
  active?: boolean
}



export interface CreateResortResponse{
  resort:IResort
}