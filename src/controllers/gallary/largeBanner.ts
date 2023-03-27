import { RequestHandler } from "express";
import GallaryService from "../../services/gallary.service";

const gallaryService = new GallaryService();

export const addLargeBanner: RequestHandler = async (req, res, next) => {
  const { image, description1, description2 } = req.body;
  const { resortId } = req.params
  try {
    console.log(resortId);
    
    const response = await gallaryService.addLargeBanner(image, description1, description2, resortId)
    const gallaryDetails = await gallaryService.findGallarybyResortId(resortId)
    res.send({ message: "acknowledged:" +response , data: gallaryDetails});
  } catch (error: any) {
    return next(error);
  }
}

export const deleteLargeBanner: RequestHandler = async (req, res, next) => {
  const { resortId, largeBannerId } = req.params
  try {
    const response = await gallaryService.deleteLargeBanner(resortId, largeBannerId)
    const gallaryDetails = await gallaryService.findGallarybyResortId(resortId)
    res.send({ message: "acknowledged:" +response , data: gallaryDetails});
  } catch (err) {
    return next(err);
  }
}

export const editBannerDetails: RequestHandler =async (req, res, next) => {
  const { resortId, largeBannerId} = req.params
  const {description1, description2} = req.body
  console.log(resortId, largeBannerId, description1, description2); 
  
  try {
    const response = await gallaryService.editBannerDetails(resortId, largeBannerId, description1, description2)
    const gallaryDetails = await gallaryService.findGallarybyResortId(resortId)
    res.send({message: "acknowledged" + response , data: gallaryDetails})
  } catch (err) {
    return next(err)
  }
}