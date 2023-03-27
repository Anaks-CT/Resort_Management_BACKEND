
import { RequestHandler } from "express";
import GallaryService from "../../services/gallary.service";

const gallaryService = new GallaryService();

export const gallaryDetails: RequestHandler = async (req, res, next) => {
  try {
    const response = await gallaryService.gallaryDetails()
    res.send({ message: "Successful", data: response});
  } catch (error: any) {
    return next(error);
  }
};

export const gallaryDetailsByResortId: RequestHandler = async (req, res, next) => {
  try {
    console.log(req.params);
    const response = await gallaryService.findGallarybyResortId(req.params.id)
    
    res.send({message: "Successful", data: response})
  } catch (error: any) {
    return next(error)
  }
}