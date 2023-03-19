import mongoose from "mongoose";
import ErrorResponse from "../error/errorResponse";
import GallaryRepositary from "../repositories/gallary.repositary";

export default class GallaryService {
    constructor(private gallaryRepositary = new GallaryRepositary()) {}

    async addLargeBanner(
        image: string,
        description1: string,
        description2: string,
        resortId: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId>
    ): Promise<Boolean> {
        // checking if the gallary is present and the error is caught in the repositary
        const gallary = await this.gallaryRepositary.findGallaryByResortId(
            resortId
        );

        //checking for image duplication
        gallary?.largeBanner.forEach((el) => {
            if (el.image === image)
                throw ErrorResponse.badRequest("Banner aldready exist");
        });

        // adding the image
        const addImageResponse = await this.gallaryRepositary.addLargeBanner(
            image,
            description1,
            description2,
            resortId
        );
        if (!addImageResponse) {
            throw ErrorResponse.internalError("Banner not added");
        }
        return addImageResponse;
    }

    async addSmallBanner(
        image: string,
        description1: string,
        description2: string,
        resortId: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId>
    ): Promise<Boolean> {
        // checking if the gallary is present and the error is caught in the repositary
        const gallary = await this.gallaryRepositary.findGallaryByResortId(
            resortId
        );

        //checking for image duplication
        gallary?.smallBanner.forEach((el) => {
            if (el.image === image)
                throw ErrorResponse.badRequest("Banner aldready exist");
        });

        // adding the image
        const addImageResponse = await this.gallaryRepositary.addSmallBanner(
            image,
            description1,
            description2,
            resortId
        );
        if (!addImageResponse) {
            throw ErrorResponse.internalError("Banner not added");
        }
        return addImageResponse;
    }
}
