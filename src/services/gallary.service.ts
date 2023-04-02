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
    ): Promise<IGallary> {
        // checking if the gallary is present and is not null
        const gallary = await this.gallaryRepositary.findGallaryByResortId(
            resortId
        );
        if (!gallary)
            throw ErrorResponse.badRequest(
                "Resortid passed doesn't match any resorts"
            );

        // checking if total images exeeds over 10
        const key = type === "largeBanner" ? "largeBanner" : "smallBanner";
        if (gallary[key].length === 10)
            throw ErrorResponse.badRequest("Cannot exeed more than 10 banners");

        //checking for image duplication
        if (type === "largeBanner") {
            gallary?.largeBanner.forEach((el) => {
                if (el.image === image)
                    throw ErrorResponse.badRequest("Banner aldready exist");
            });
        } else if (type === "smallBanner") {
            gallary?.smallBanner.forEach((el) => {
                if (el.image === image)
                    throw ErrorResponse.badRequest("Banner aldready exist");
            });
        }

        // adding the image
        const UpdatedData: unknown = await this.gallaryRepositary.addBanner(
            type,
            image,
            description1,
            description2,
            resortId
        );

        //throwing error Banner not added for some reason
        if (!UpdatedData) {
            throw ErrorResponse.internalError("Banner not added");
        }

        return UpdatedData as IGallary;
    }

    async deleteBanner(
        type: "largeBanner" | "smallBanner",
        resortId: string,
        bannerId: string
    ): Promise<IGallary> {
        const deleteLargeBanner: unknown =
            await this.gallaryRepositary.deleteBannerbyId(
                type,
                resortId,
                bannerId
            );
        if (!deleteLargeBanner)
            throw ErrorResponse.badRequest("Banner not deleted");
        return deleteLargeBanner as IGallary;
    }

    async editBannerDetails(
        type: "largeBanner" | "smallBanner",
        resortId: string,
        bannerId: string,
        description1: string,
        description2: string
    ) {
        const editResponse: unknown =
            await this.gallaryRepositary.editBannerDetails(
                type,
                resortId,
                bannerId,
                description1,
                description2
            );
        if (!editResponse) throw ErrorResponse.badRequest("Banner not edited");
        return editResponse as IGallary;
    }

    async editBannerImage(
        type: "largeBanner" | "smallBanner",
        resortId: string,
        bannerId: string,
        image: string
    ): Promise<IGallary> {
        const editResponse: unknown =
            await this.gallaryRepositary.editBannerImage(
                type,
                resortId,
                bannerId,
                image
            );
        if (!editResponse) throw ErrorResponse.badRequest("Banner not edited");
        return editResponse as IGallary;
    }

    async addCommunityPic(resortId: string, image: string): Promise<IGallary> {
        // checking if the gallary is present and the error is caught in the repositary
        const gallary = await this.gallaryRepositary.findGallaryByResortId(
            resortId
        );
        if (!gallary)
            throw ErrorResponse.badRequest(
                "Resortid passed doesn't match any resorts"
            );

        // checking if total images exeeds over 10
        if (gallary.communityPics.length === 10)
            throw ErrorResponse.badRequest("Cannot exeed more than 10 banners");

        //checking for image duplication
        gallary?.communityPics.forEach((el) => {
            if (el === image)
                throw ErrorResponse.badRequest("Picture aldready exist");
        });

        //adding the picture
        const addImageResponse: unknown =
            await this.gallaryRepositary.addCommunityPic(resortId, image);

        //throwing error in case picture not added for some reason
        if (!addImageResponse) {
            throw ErrorResponse.internalError("Banner not added");
        }
        return addImageResponse as IGallary;
    }

    async editCommunityPic(
        resortId: string,
        oldImage: string,
        newImage: string
    ): Promise<IGallary> {
        // checking if the gallary exits using the resortId
        const gallary = await this.gallaryRepositary.findGallaryByResortId(
            resortId
        );
        if (!gallary)
            throw ErrorResponse.badRequest(
                "ResortId doesn't match any resorts"
            );

        // finding the index of the old image url in the community pics array
        const index = gallary.communityPics.indexOf(oldImage);

        if (index === -1) throw ErrorResponse.notFound("Image not found");

        const updatedResult: unknown =
            await this.gallaryRepositary.editCommunityPic(
                resortId,
                index,
                newImage
            );

        if (!updatedResult)
            throw ErrorResponse.internalError("Image is not updated");
        return updatedResult as IGallary;
    }

    async deleteCommunityPic(
        resortId: string,
        imageUrl: string
    ): Promise<IGallary> {
        // checking if the gallary exits using the resortId
        const gallary = await this.gallaryRepositary.findGallaryByResortId(
            resortId
        );
        if (!gallary)
            throw ErrorResponse.badRequest(
                "ResortId doesn't match any resorts"
            );

        const deleteResponse: unknown =
            await this.gallaryRepositary.deleteCommunityPic(resortId, imageUrl);
        // throwing an error if the modified count is 0
        if (deleteResponse === 0)
            throw ErrorResponse.internalError("Community pic not deleted");
        return deleteResponse as IGallary;
    }

    async gallaryDetails(): Promise<IGallary[] | null> {
        const gallaryDetails = await this.gallaryRepositary.GallaryDetails();
        if (!gallaryDetails)
            throw ErrorResponse.badRequest("Gallary database is empty");
        return gallaryDetails;
    }

    async findGallarybyResortId(resortId: string): Promise<IGallary | null> {
        const gallaryDetails =
            await this.gallaryRepositary.findGallaryByResortId(resortId);
        if (!gallaryDetails)
            throw ErrorResponse.badRequest("Cannot find Gallary");
        return gallaryDetails;
    }
}
