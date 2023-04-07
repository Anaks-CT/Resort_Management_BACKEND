import express from "express";
import { createResort, editResort, editResortActive } from "../controllers/resort/resortCRUD";
import {
    getAllResortDetails,
    getSearchSortResortDetails,
    getSingleResort,
} from "../controllers/resort/getAllResortDetails";
import { resortValidate } from "../middlewares/bodyValidation";

export const resort = express.Router();

resort
    .route("/resort/:resortId?")
    .get(getAllResortDetails)
    .post(resortValidate, createResort)
    .put(editResort)
    .delete(editResortActive)

resort.get('/resortDetailService',getSearchSortResortDetails) 
resort.post("/getResortById/:resortId", getSingleResort);
