import { UpdateQuery, UpdateWriteOpResult } from "mongoose";
import { IGallary } from "../interface/gallary.interface";
import resortGallaryModel from "../models/resortGallary.model";
import { ObjectId } from "mongodb";
import { BaseRepository } from "./baseRepositary";

// import ObjectId from "mong"

class GallaryRepositary extends BaseRepository {
    constructor() {
        super(resortGallaryModel);
    }

    async createGallary(resortId: string): Promise<IGallary | null> {
        const newGallary = {
            resortid: new ObjectId(resortId),
        };
        return this.create<any>(newGallary);
    }

    async addBanner(
        type: "largeBanner" | "smallBanner",
        image: string,
        description1: string,
        description2: string,
        resortId: string
    ): Promise<UpdateWriteOpResult> {
        const key = type === "largeBanner" ? "largeBanner" : "smallBanner";
        const addImage: UpdateQuery<any> = await resortGallaryModel.updateOne(
            { resortid: new ObjectId(resortId) },
            {
                $addToSet: {
                    [key]: {
                        image: image,
                        description1: description1,
                        description2: description2,
                    },
                },
            }
        );
        return addImage.acknowledged;
    }

    async deleteBannerbyId(
        type: "largeBanner" | "smallBanner",
        resortId: string,
        largeBannerId: string
    ): Promise<UpdateWriteOpResult> {
        const key = type === "largeBanner" ? "largeBanner" : "smallBanner";
        const deleteResponse = await resortGallaryModel.updateOne(
            { resortid: new ObjectId(resortId) },
            {
                $pull: {
                    [key]: {
                        _id: new ObjectId(largeBannerId),
                    },
                },
            }
        );
        return deleteResponse
    }

    async editBannerDetails(
        type: "largeBanner" | "smallBanner",
        resortId: string,
        bannerId: string,
        description1: string,
        description2: string
    ): Promise<UpdateWriteOpResult> {
        const key = type === "largeBanner" ? "largeBanner" : "smallBanner";
        const editResponse = await resortGallaryModel.updateOne(
            {
                resortid: new ObjectId(resortId),
                [`${key}._id`]: new ObjectId(bannerId),
            },
            {
                $set: {
                    [`${key}.$.description1`]: description1,
                    [`${key}.$.description2`]: description2,
                },
            }
        );
        return editResponse;
    }

    async editBannerImage(
        type: "largeBanner" | "smallBanner",
        resortId: string,
        largeBannerId: string,
        image: string
    ): Promise<UpdateWriteOpResult> {
        const key = type === "largeBanner" ? "largeBanner" : "smallBanner";
        const editResponse = await resortGallaryModel.updateOne(
            {
                resortid: new ObjectId(resortId),
                [`${key}._id`]: new ObjectId(largeBannerId),
            },
            {
                $set: {
                    [`${key}.$.image`]: image,
                },
            }
        );
        return editResponse;
    }

    async addCommunityPic(
        resortId: string,
        image: string
    ): Promise<UpdateWriteOpResult> {
        const addImage: UpdateQuery<any> = await resortGallaryModel.updateOne(
            { resortid: new ObjectId(resortId) },
            {
                $addToSet: {
                    communityPics: image,
                },
            }
        );
        return addImage.acknowledged;
    }

    async findGallaryByResortId(resortId: string): Promise<IGallary | null> {
        return await resortGallaryModel.findOne({
            resortid: new ObjectId(resortId),
        });
    }

    async GallaryDetails(): Promise<IGallary[] | null> {
        return await this.getAll<IGallary>();
    }
}

export default GallaryRepositary;
