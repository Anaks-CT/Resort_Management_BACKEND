import mongoose, {
    isObjectIdOrHexString,
    isValidObjectId,
    Query,
    Types,
    UpdateQuery,
} from "mongoose";
import ErrorResponse from "../error/errorResponse";
import { IGallary } from "../interface/gallary.interface";
import resortGallaryModel from "../models/resortGallary.model";
const ObjectId = require("mongodb").ObjectId;

class GallaryRepositary {
    async createGallary(resortId: string): Promise<IGallary | null> {
        const gallary = new resortGallaryModel({
            resortid: new ObjectId(resortId),
        });
        await gallary.save();
        return gallary.toJSON() as IGallary;
    }

    async addLargeBanner(
        image: string,
        description1: string,
        description2: string,
        resortId: string
    ): Promise<boolean> {
        const addImage: UpdateQuery<any> = await resortGallaryModel.updateOne(
            { resortid: new ObjectId(resortId) },
            {
                $addToSet: {
                    largeBanner: {
                        image: image,
                        description1: description1,
                        description2: description2,
                    },
                },
            }
        );
        return addImage.acknowledged;
    }

    async deleteLargeBannerbyId(resortId: string, largeBannerId: string) {
        //****************** don't forget to write the return type of this***************************/

        const deleteResponse = await resortGallaryModel.updateOne(
            { resortid: new ObjectId(resortId) },
            {
                $pull: {
                    largeBanner: {
                        _id: new ObjectId(largeBannerId),
                    },
                },
            }
        );
        return deleteResponse;
    }

    async editLargeBannerDetails(
        resortId: string,
        largeBannerId: string,
        description1: string,
        description2: string
    ) {
        const editResponse = await resortGallaryModel.updateOne(
            {
                resortid: new ObjectId(resortId),
                "largeBanner._id": new ObjectId(largeBannerId),
            },
            {
                $set: {
                    "largeBanner.$.description1": description1,
                    "largeBanner.$.description2": description2,
                },
            }
        );
        return editResponse
    }



    async addCommunityPic(
        resortId: string,
        image: string
    ): Promise<Boolean | null> {
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

    async addSmallBanner(
        image: string,
        description1: string,
        description2: string,
        resortId: string
    ): Promise<boolean> {
        const addImage: UpdateQuery<any> = await resortGallaryModel.updateOne(
            { resortid: new ObjectId(resortId) },
            {
                $addToSet: {
                    smallBanner: {
                        image: image,
                        description1: description1,
                        description2: description2,
                    },
                },
            }
        );
        return addImage.acknowledged;
    }

    async findGallaryByResortId(resortId: string): Promise<IGallary | null> {
        try {
            const gallary = await resortGallaryModel.findOne({
                resortid: new ObjectId(resortId),
            });
            return gallary ? (gallary.toJSON() as IGallary) : null;
        } catch (error) {
            ///////////////////////////// if the id passed does not match with the mongoose id type////////////////////////
            // not sure if this is a good practice since mongodb might have thrown the error for something different error which wont be caught in the error. for example if we changed the details passing down
            throw ErrorResponse.internalError(
                "ResortId is not of the type mongooose.objectID"
            );
        }
    }

    async GallaryDetails(): Promise<IGallary[] | null> {
        const gallary = await resortGallaryModel.find();
        return gallary;
    }
}

export default GallaryRepositary;
