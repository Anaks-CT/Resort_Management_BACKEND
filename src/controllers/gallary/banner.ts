import { RequestHandler } from "express";
import GallaryService from "../../services/gallary.service";

const gallaryService = new GallaryService();
type BannerType = "largeBanner" | "smallBanner";

export const addBanner: RequestHandler = async (req, res, next) => {
    const { image, description1, description2, banner } = req.body;
    const { resortId } = req.params;
    try {
        const response = await gallaryService.addBanner(
            banner,
            image,
            description1,
            description2,
            resortId
        );
        const gallaryDetails = await gallaryService.findGallarybyResortId(
            resortId
        );
        res.send({ message: "acknowledged:" + response, data: gallaryDetails });
    } catch (error: any) {
        return next(error);
    }
};

export const deleteBanner: RequestHandler = async (req, res, next) => {
    const { resortId, largeBannerId, smallBannerId } = req.params;
    const  banner: "largeBanner" | "smallBanner" = req.params.banner as BannerType

    try {
        const response = await gallaryService.deleteBanner(
            banner,
            resortId,
            banner === "largeBanner" ? largeBannerId : smallBannerId
        );
        const gallaryDetails = await gallaryService.findGallarybyResortId(
            resortId
        );
        res.send({ message: "acknowledged:" + response, data: gallaryDetails });
    } catch (err) {
        return next(err);
    }
};

export const editBannerDetails: RequestHandler = async (req, res, next) => {
    const { resortId, largeBannerId, smallBannerId } = req.params;
    const { description1, description2, banner } = req.body;
    console.log(largeBannerId, smallBannerId, banner);
    
    try {
        const response = await gallaryService.editBannerDetails(
            banner,
            resortId,
            banner === "largeBanner" ? largeBannerId : smallBannerId,
            description1,
            description2
        );
        const gallaryDetails = await gallaryService.findGallarybyResortId(
            resortId
        );
        res.send({ message: "acknowledged" + response, data: gallaryDetails });
    } catch (err) {
        return next(err);
    }
};

export const editBannerImage: RequestHandler = async (req, res, next) => {
    const { resortId, largeBannerId, smallBannerId } = req.params;
    const { image, banner } = req.body;
    try {
        const response = await gallaryService.editBannerImage(
            banner,
            resortId,
            banner === "largeBanner" ? largeBannerId : smallBannerId,
            image
        );
        const gallaryDetails = await gallaryService.findGallarybyResortId(
            resortId
        );
        res.send({ message: "acknowledged" + response, data: gallaryDetails });
    } catch (err) {
        return next(err);
    }
};
