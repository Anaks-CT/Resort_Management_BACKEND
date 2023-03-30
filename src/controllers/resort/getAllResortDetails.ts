import ResortService from "../../services/resort.service";
import { RequestHandler } from "express";

const resortService = new ResortService();

export const getAllResortDetails: RequestHandler = async (req, res, next) => {
  try {
    const  resort  = await resortService.allResortDetails()
    res.send({ message: "Fetching data successful", data: resort });
  } catch (error: unknown) {
    return next(error);
  }
};

export const getSingleResort: RequestHandler = async (req, res, next) => {
  try {
    console.log(req.params.resortId);
    
    const  resort  = await resortService.getResortById(req.params.resortId)
    res.send({ message: "Fetching data successful", data: resort });
  } catch (error: unknown) {
    return next(error);
  }
};