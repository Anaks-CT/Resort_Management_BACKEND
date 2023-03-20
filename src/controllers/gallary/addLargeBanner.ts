import { RequestHandler } from "express";
import GallaryService from "../../services/gallary.service";

const gallaryService = new GallaryService();

export const addLargeBanner: RequestHandler = async (req, res, next) => {
  const { image, description1, description2, resortId } = req.body;
  try {
    const response = await gallaryService.addLargeBanner(image, description1, description2, resortId)
    res.send({ message: "Large banner added", data: response});
  } catch (error: any) {
    return next(error);
  }
};