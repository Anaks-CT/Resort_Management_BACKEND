
import { RequestHandler } from "express";
import GallaryService from "../../services/gallary.service";
import expressAsyncHandler from "express-async-handler";
import { RequestWithUser } from "../../middlewares/auth-middlewares";
import ResortService from "../../services/resort.service";

const gallaryService = new GallaryService();
const resortService = new ResortService()

export const gallaryDetails =expressAsyncHandler( async (req, res) => {
    const response = await gallaryService.gallaryDetails()
    res.status(200).json({ message: "Successful", data: response});
});


export const gallaryDetailsByManagerId = expressAsyncHandler( async (req: RequestWithUser, res) => {
    const {_id: managerId} = req.user
    const {_id: resortId} = await resortService.getResortByManagerId(managerId)
    const gallaryDetails = await gallaryService.findGallarybyResortId(resortId)
    res.status(200).json({message:"Gallery details fetched succesfully", data: gallaryDetails})

}) 

export const gallaryDetailsByResortId =expressAsyncHandler( async (req, res) => {
    const response = await gallaryService.findGallarybyResortId(req.params.id)
    res.status(200).json({message: "Successful", data: response})
})