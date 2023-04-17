import express from "express";
import { createResort, editResort, editResortActive } from "../controllers/resort/resortCRUD";
import {
    getAllResortDetails,
    getSearchSortResortDetails,
    getSingleResort,
} from "../controllers/resort/getAllResortDetails";
import { resortValidate } from "../middlewares/bodyValidation";
import { adminVerify } from "../middlewares/auth-middlewares";

export const resort = express.Router();

resort
    .route("/resort/:resortId?")
    .get(getAllResortDetails)
    .post(adminVerify, resortValidate, createResort)
    .put(adminVerify, editResort)
    .delete(adminVerify, editResortActive)

resort.get('/resortDetailService',getSearchSortResortDetails) 
resort.post("/getResortById/:resortId", getSingleResort);
