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

export const gallary = express.Router();

gallary
    .route("/largeBanner/:resortId/:largeBannerId?/:banner?")
    .post(addBanner)
    .delete(deleteBanner)
    .patch(editBannerDetails)
    .put(editBannerImage);

gallary
    .route("/smallBanner/:resortId/:smallBannerId?/:banner?")
    .post(addBanner)
    .delete(deleteBanner)
    .patch(editBannerDetails)
    .put(editBannerImage);
gallary
    .route("/communityBanner")
    .post(addCommunityPic)
    .delete(deleteCommunityPic)
    .put(editCommunityPic)
gallary.get("/getAllGallaryDetails", gallaryDetails);
gallary.get("/getGallaryByResortId/:id", gallaryDetailsByResortId); 
gallary.get("/getGallary");
