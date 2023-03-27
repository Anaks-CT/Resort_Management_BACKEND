import mongoose, { Document } from "mongoose";

export interface IBannerDetails {
    _id?: mongoose.Types.ObjectId;
    image: string;
    description1: string;
    description2: string;
}

export interface IGallary extends Document {
    resortid?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId>;
    largeBanner: IBannerDetails[];
    smallBanner: IBannerDetails[];
    communityPics: string[];
}
