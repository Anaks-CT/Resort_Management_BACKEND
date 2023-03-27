import express from "express";
import { addCommunityPic } from "../controllers/gallary/addCommunityPic";
import {
    addLargeBanner,
    deleteLargeBanner,
    editBannerDetails,
} from "../controllers/gallary/largeBanner";
import { addSmallBanner } from "../controllers/gallary/addSmallbanner";
import {
    gallaryDetails,
    gallaryDetailsByResortId,
} from "../controllers/gallary/fetchGallaryDetails";

export const gallary = express.Router();

gallary
    .route("/largeBanner/:resortId/:largeBannerId?")
    .post(addLargeBanner)
    .delete(deleteLargeBanner)
    .patch(editBannerDetails);
gallary.post("/addSmallBanner", addSmallBanner);
gallary.post("/addCommunityPic", addCommunityPic);
gallary.get("/getAllGallaryDetails", gallaryDetails);
gallary.get("/getGallaryByResortId/:id", gallaryDetailsByResortId);
