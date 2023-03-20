import ResortService from "../../services/resort.service";
import { RequestHandler } from "express";

const resortService = new ResortService();

export const getAllResortDetails: RequestHandler = async (req, res, next) => {
  try {
    const  resort  = await resortService.allResortDetails()
    res.send({ message: "Fetching data successful", data: resort });
  } catch (error: any) {
    return next(error);
  }
};
