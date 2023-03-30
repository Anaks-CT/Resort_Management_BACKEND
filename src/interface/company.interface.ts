import mongoose, { Document } from "mongoose";

export type circleBanner = {
    miniHeading: string;
    heading: string;
    description: string;
    image: string;
};
export interface ICompany  {
    companyName: string;
    resortDetails?: string[];
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
