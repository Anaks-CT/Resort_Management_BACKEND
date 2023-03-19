import ResortService from "../../services/resort.service";
import { RequestHandler } from "express";

const resortService = new ResortService();

export const createResort: RequestHandler = async (req, res, next) => {
  const { resortDetails, location, email, customerCareNo } = req.body;
  try {
    const { resort } = await resortService.createResort(
      resortDetails,
      location,
      email,
      customerCareNo
    );
    res.send({ message: "New Resort created", data: resort });
  } catch (error: any) {
    return next(error);
  }
};
