import { RequestHandler } from "express";
import GallaryService from "../../services/gallary.service";

const gallaryService = new GallaryService();

export const addLargeBanner: RequestHandler = async (req, res, next) => {
    const { image, description1, description2 } = req.body;
    const { resortId } = req.params;
    try {
        const response = await gallaryService.addBanner(
            "largeBanner",
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

export const deleteLargeBanner: RequestHandler = async (req, res, next) => {
    const { resortId, largeBannerId } = req.params;
    try {
        const response = await gallaryService.deleteBanner(
            "largeBanner",
            resortId,
            largeBannerId
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
    const { resortId, largeBannerId } = req.params;
    const { description1, description2 } = req.body;
    try {
        const response = await gallaryService.editBannerDetails(
            "largeBanner",
            resortId,
            largeBannerId,
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
    const { resortId, largeBannerId } = req.params;
    const { image } = req.body;
    try {
        const response = await gallaryService.editBannerImage(
            "largeBanner",
            resortId,
            largeBannerId,
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
