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
    ): Promise<boolean | null> {
        const key = type === "largeBanner" ? "largeBanner" : "smallBanner";
        return await resortGallaryModel.findOneAndUpdate(
            { resortid: new ObjectId(resortId) },
            {
                $addToSet: {
                    [key]: {
                        image: image,
                        description1: description1,
                        description2: description2,
                    },
                },
            },
            { new: true }
        )
    }

    async deleteBannerbyId(
        type: "largeBanner" | "smallBanner",
        resortId: string,
        bannerId: string
    ): Promise<boolean | null> {
        const key = type === "largeBanner" ? "largeBanner" : "smallBanner";
        return await resortGallaryModel.findOneAndUpdate(
            { resortid: new ObjectId(resortId) },
            {
                $pull: {
                    [key]: {
                        _id: new ObjectId(bannerId),
                    },
                },
            },
            { new: true }
        );
    }

    async editBannerDetails(
        type: "largeBanner" | "smallBanner",
        resortId: string,
        bannerId: string,
        description1: string,
        description2: string
    ): Promise<boolean | null> {
        const key = type === "largeBanner" ? "largeBanner" : "smallBanner";
        return await resortGallaryModel.findOneAndUpdate(
            {
                resortid: new ObjectId(resortId),
                [`${key}._id`]: new ObjectId(bannerId),
            },
            {
                $set: {
                    [`${key}.$.description1`]: description1,
                    [`${key}.$.description2`]: description2,
                },
            },
            { new: true }
        );
    }

    async editBannerImage(
        type: "largeBanner" | "smallBanner",
        resortId: string,
        bannerId: string,
        image: string
    ): Promise<boolean | null> {
        const key = type === "largeBanner" ? "largeBanner" : "smallBanner";
        return await resortGallaryModel.findOneAndUpdate(
            {
                resortid: new ObjectId(resortId),
                [`${key}._id`]: new ObjectId(bannerId),
            },
            {
                $set: {
                    [`${key}.$.image`]: image,
                },
            },
            { new: true }
        );
    }

    async addCommunityPic(
        resortId: string,
        image: string
    ): Promise<boolean | null> {
        return await resortGallaryModel.findOneAndUpdate(
            { resortid: new ObjectId(resortId) },
            {
                $addToSet: {
                    communityPics: image,
                },
            },
            {new: true}
        );
    }

    async deleteCommunityPic(
        resortId: string,
        image: string
    ): Promise<boolean | null> {
        return await resortGallaryModel.findOneAndUpdate(
            {
                resortid: new ObjectId(resortId),
            },
            {
                $pull: {
                    communityPics: image,
                },
            },
            { new: true}
        );
    }

    async editCommunityPic(
        resortId: string,
        index: number,
        newImage: string
    ): Promise<boolean | null> {
        return await resortGallaryModel.findOneAndUpdate(
            { resortid: new ObjectId(resortId) },
            {
                $set: {
                    [`communityPics.${index}`]: newImage,
                },
            },
            { new: true }
        );
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
