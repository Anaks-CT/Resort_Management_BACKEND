"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gallary = void 0;
const express_1 = __importDefault(require("express"));
const communityPic_1 = require("../controllers/gallary/communityPic");
const banner_1 = require("../controllers/gallary/banner");
const fetchGallaryDetails_1 = require("../controllers/gallary/fetchGallaryDetails");
const auth_middlewares_1 = require("../middlewares/auth-middlewares");
exports.gallary = express_1.default.Router();
exports.gallary
    .route("/largeBanner/:resortId/:largeBannerId?/:banner?")
    .post(auth_middlewares_1.adminVerify, banner_1.addBanner)
    .delete(auth_middlewares_1.adminVerify, banner_1.deleteBanner)
    .patch(auth_middlewares_1.adminVerify, banner_1.editBannerDetails)
    .put(auth_middlewares_1.adminVerify, banner_1.editBannerImage);
exports.gallary
    .route("/smallBanner/:resortId/:smallBannerId?/:banner?")
    .post(auth_middlewares_1.adminVerify, banner_1.addBanner)
    .delete(auth_middlewares_1.adminVerify, banner_1.deleteBanner)
    .patch(auth_middlewares_1.adminVerify, banner_1.editBannerDetails)
    .put(auth_middlewares_1.adminVerify, banner_1.editBannerImage);
exports.gallary
    .route("/communityBanner")
    .post(auth_middlewares_1.adminVerify, communityPic_1.addCommunityPic)
    .delete(auth_middlewares_1.adminVerify, communityPic_1.deleteCommunityPic)
    .put(auth_middlewares_1.adminVerify, communityPic_1.editCommunityPic);
exports.gallary.get("/getAllGallaryDetails", fetchGallaryDetails_1.gallaryDetails);
exports.gallary.get("/getGallaryByResortId/:id", fetchGallaryDetails_1.gallaryDetailsByResortId);
exports.gallary.get("/getGallary");
