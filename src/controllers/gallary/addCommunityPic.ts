import { RequestHandler } from "express";
import GallaryService from "../../services/gallary.service";

const gallaryService = new GallaryService();

export const addCommunityPic: RequestHandler = async (req, res, next) => {
    const { image, resortId } = req.body;
    try {
        const response = await gallaryService.addCommunityPic(resortId, image);
        res.send({ message: "Picture added successfully", data: response });
    } catch (error: any) {
        return next(error);
    }
};
