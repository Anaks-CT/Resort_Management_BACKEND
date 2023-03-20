import mongoose, { Document } from "mongoose";

export type circleBanner = {
    miniHeading: String;
    heading: String;
    description: String;
    image: String;
};
export interface ICompany extends Document {
    companyName: string;
    resortDetails?: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId>[];
    bannerDetails: {
        image: string;
        description: string;
    };
    circleBanners: circleBanner[];
    faqs: {
        Q: string;
        A: string;
    }[];
}

// export interface CreateResortResponse{
//   resort:ICompany
// }
