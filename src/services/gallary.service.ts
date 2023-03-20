import mongoose from "mongoose";
import ErrorResponse from "../error/errorResponse";
import { IGallary } from "../interface/gallary.interface";
import GallaryRepositary from "../repositories/gallary.repositary";

export default class GallaryService {
    constructor(private gallaryRepositary = new GallaryRepositary()) {}

    async addLargeBanner(
        image: string,
        description1: string,
        description2: string,
        resortId: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId>
    ): Promise<Boolean> {
        // checking if the gallary is present and is not null
        const gallary = await this.gallaryRepositary.findGallaryByResortId(
            resortId
        );
        if (!gallary)
            throw ErrorResponse.badRequest(
                "Resortid passed doesn't match any resorts"
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

        //throwing error Banner not added for some reason
        if (!addImageResponse) {
            throw ErrorResponse.internalError("Banner not added");
        }
        return addImageResponse;
    }

    async addCommunityPic(
        resortId: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId>,
        image: string
    ): Promise<Boolean | null> {
        // checking if the gallary is present and the error is caught in the repositary
        const gallary = await this.gallaryRepositary.findGallaryByResortId(
            resortId
        );
        if (!gallary)
            throw ErrorResponse.badRequest(
                "Resortid passed doesn't match any resorts"
            );

        //checking for image duplication
        gallary?.communityPics.forEach((el) => {
            if (el === image)
                throw ErrorResponse.badRequest("Picture aldready exist");
        });

        //adding the picture
        const addImageResponse = await this.gallaryRepositary.addCommunityPic(resortId, image)

        //throwing error in case picture not added for some reason
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
        if (!gallary)
            throw ErrorResponse.badRequest(
                "Resortid passed doesn't match any resorts"
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

        // throwing error if banner not added for some reason
        if (!addImageResponse) {
            throw ErrorResponse.internalError("Banner not added");
        }
        return addImageResponse;
    }

    async gallaryDetails(): Promise<IGallary[] | null> {
        const gallaryDetails = await this.gallaryRepositary.GallaryDetails();
        if (!gallaryDetails)
            throw ErrorResponse.badRequest("Gallary database is empty");
        return gallaryDetails;
    }
}
