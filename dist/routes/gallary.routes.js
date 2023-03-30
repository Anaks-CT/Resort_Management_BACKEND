"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gallary = void 0;
const express_1 = __importDefault(require("express"));
const addCommunityPic_1 = require("../controllers/gallary/addCommunityPic");
const largeBanner_1 = require("../controllers/gallary/largeBanner");
const smallbanner_1 = require("../controllers/gallary/smallbanner");
const fetchGallaryDetails_1 = require("../controllers/gallary/fetchGallaryDetails");
exports.gallary = express_1.default.Router();
exports.gallary
    .route("/largeBanner/:resortId/:largeBannerId?")
    .post(largeBanner_1.addLargeBanner)
    .delete(largeBanner_1.deleteLargeBanner)
    .patch(largeBanner_1.editBannerDetails)
    .put(largeBanner_1.editBannerImage);
exports.gallary.post("/addSmallBanner", smallbanner_1.addSmallBanner);
exports.gallary.post("/addCommunityPic", addCommunityPic_1.addCommunityPic);
exports.gallary.get("/getAllGallaryDetails", fetchGallaryDetails_1.gallaryDetails);
exports.gallary.get("/getGallaryByResortId/:id", fetchGallaryDetails_1.gallaryDetailsByResortId);
