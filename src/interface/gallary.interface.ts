import mongoose, { Document } from "mongoose";
import { ObjectId } from "mongodb";


export interface IBannerDetails {
    _id?: string;
    image: string;
    description1: string;
    description2: string;
}

export interface IGallary{
    _id?: string
    resortid?: ObjectId;
    largeBanner: IBannerDetails[];
    smallBanner: IBannerDetails[];
    communityPics: string[];
    active?: boolean
}
