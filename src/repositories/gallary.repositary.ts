import mongoose, { Query, UpdateQuery } from "mongoose";
import ErrorResponse from "../error/errorResponse";
import { IGallary } from "../interface/gallary.interface";
import resortGallaryModel from "../models/resortGallary.model";

class GallaryRepositary {
    async createGallary(
        resortId: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId>
    ): Promise<IGallary | null> {
        const gallary = new resortGallaryModel({
            resortid: resortId,
        });
        await gallary.save();
        return gallary.toJSON() as IGallary;
    }

    async addLargeBanner(
        image: string,
        description1: string,
        description2: string,
        resortId: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId>
    ): Promise<boolean> {
        const addImage: UpdateQuery<any> = await resortGallaryModel.updateOne(
            { resortid: resortId },
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
    
    async addCommunityPic(resortId: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId>, image: string): Promise<Boolean | null>{
        const addImage: UpdateQuery<any> = await resortGallaryModel.updateOne(
            {resortid: resortId},
            {
                $addToSet: {
                    communityPics: image
                }
            }
        )
        return addImage.acknowledged;
    }

    async addSmallBanner(
        image: string,
        description1: string,
        description2: string,
        resortId: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId>
    ): Promise<boolean> {
        const addImage: UpdateQuery<any> = await resortGallaryModel.updateOne(
            { resortid: resortId },
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

    async findGallaryByResortId(
        resortId: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId>
    ): Promise<IGallary | null> {
        try {
            const gallary = await resortGallaryModel.findOne({
                resortid: resortId,
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
