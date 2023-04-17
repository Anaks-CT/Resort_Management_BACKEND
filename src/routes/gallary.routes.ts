import express from "express";
import {
    addCommunityPic,
    deleteCommunityPic,
    editCommunityPic,
} from "../controllers/gallary/communityPic";
import {
    addBanner,
    deleteBanner,
    editBannerDetails,
    editBannerImage,
} from "../controllers/gallary/banner";
import {
    gallaryDetails,
    gallaryDetailsByResortId,
} from "../controllers/gallary/fetchGallaryDetails";
import { adminVerify } from "../middlewares/auth-middlewares";

export const gallary = express.Router();

gallary
    .route("/largeBanner/:resortId/:largeBannerId?/:banner?")
    .post(adminVerify, addBanner)
    .delete(adminVerify, deleteBanner)
    .patch(adminVerify, editBannerDetails)
    .put(adminVerify, editBannerImage);

gallary
    .route("/smallBanner/:resortId/:smallBannerId?/:banner?")
    .post(adminVerify, addBanner)
    .delete(adminVerify, deleteBanner)
    .patch(adminVerify, editBannerDetails)
    .put(adminVerify, editBannerImage);
gallary
    .route("/communityBanner")
    .post(adminVerify, addCommunityPic)
    .delete(adminVerify, deleteCommunityPic)
    .put(adminVerify, editCommunityPic);
gallary.get("/getAllGallaryDetails", gallaryDetails);
gallary.get("/getGallaryByResortId/:id", gallaryDetailsByResortId);
gallary.get("/getGallary");
