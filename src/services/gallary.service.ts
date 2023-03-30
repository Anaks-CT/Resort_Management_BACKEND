import mongoose, { UpdateWriteOpResult } from "mongoose";
import ErrorResponse from "../error/errorResponse";
import { IGallary } from "../interface/gallary.interface";
import GallaryRepositary from "../repositories/gallary.repositary";

export default class GallaryService {
    constructor(private gallaryRepositary = new GallaryRepositary()) {}

    async addBanner(
        type: "largeBanner" | "smallBanner",
        image: string,
        description1: string,
        description2: string,
        resortId: string
    ): Promise<UpdateWriteOpResult> {
        // checking if the gallary is present and is not null
        const gallary = await this.gallaryRepositary.findGallaryByResortId(
            resortId
        );
        if (!gallary)
            throw ErrorResponse.badRequest(
                "Resortid passed doesn't match any resorts"
            );

        //checking for image duplication
        if (type === "largeBanner") {
            gallary?.largeBanner.forEach((el) => {
                if (el.image === image)
                    throw ErrorResponse.badRequest("Banner aldready exist");
            });
        }else if(type === "smallBanner"){
            gallary?.smallBanner.forEach((el) => {
                if (el.image === image)
                    throw ErrorResponse.badRequest("Banner aldready exist");
            });
        }

        // adding the image
        const addImageResponse = await this.gallaryRepositary.addBanner(
            type,
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

    async deleteBanner(
        type: "largeBanner" | "smallBanner",
        resortId: string,
        largeBannerId: string
    ) {
        //*************************dont forget to write the return tupe of this******************** //
        const deleteLargeBanner = this.gallaryRepositary.deleteBannerbyId(
            type,
            resortId,
            largeBannerId
        );
        if(!deleteLargeBanner)
            throw ErrorResponse.badRequest('Banner not deleted')
        return deleteLargeBanner;
    }

    async editBannerDetails(
        type: "largeBanner" | "smallBanner",
        resortId: string,
        bannerId: string,
        description1: string,
        description2: string
    ){
        const editResponse = this.gallaryRepositary.editBannerDetails(type, resortId, bannerId, description1, description2)
        if(!editResponse)
            throw ErrorResponse.badRequest('Banner not edited')
        return editResponse
    }

    async editBannerImage(
        type: "largeBanner" | "smallBanner",
        resortId: string,
        bannerId: string,
        image: string,
    ){
        const editResponse = this.gallaryRepositary.editBannerImage(type, resortId, bannerId, image)
        if(!editResponse)
            throw ErrorResponse.badRequest('Banner not edited')
        return editResponse
    }

    async addCommunityPic(
        resortId: string,
        image: string
    ): Promise<UpdateWriteOpResult> {
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
        const addImageResponse = await this.gallaryRepositary.addCommunityPic(
            resortId,
            image
        );

        //throwing error in case picture not added for some reason
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

    async findGallarybyResortId(
        resortId: string
    ): Promise<IGallary | null> {
        const gallaryDetails =
            await this.gallaryRepositary.findGallaryByResortId(resortId);
        if (!gallaryDetails)
            throw ErrorResponse.badRequest("Cannot find Gallary");
        return gallaryDetails;
    }
}
