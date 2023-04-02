import { RequestHandler } from "express";
import GallaryService from "../../services/gallary.service";
import AsyncHandler from "express-async-handler";

const gallaryService = new GallaryService();

export const addCommunityPic = AsyncHandler(async (req, res) => {
    const { image } = req.body;
    const { resortId } = req.query as any;
    const updatedData = await gallaryService.addCommunityPic(resortId, image);
    res.json({
        message: `Picture added successfully`,
        data: updatedData,
    });
});

export const editCommunityPic = AsyncHandler(async (req, res) => {
    const { resortId, prevImage } = req.query as any;
    const { image } = req.body;
    const updatedResponse = await gallaryService.editCommunityPic(
        resortId,
        prevImage,
        image
    );
    res.json({ message: "Image updated Successfully", data: updatedResponse });
});

export const deleteCommunityPic = AsyncHandler(async (req, res) => {
    const { resortId, image } = req.query as any;
    const udpatedData = await gallaryService.deleteCommunityPic(resortId, image);
    res.json({
        message: `Picture deleted successfully`,
        data: udpatedData,
    });
});
