"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gallary = void 0;
const express_1 = __importDefault(require("express"));
const addCommunityPic_1 = require("../controllers/gallary/addCommunityPic");
const addLargeBanner_1 = require("../controllers/gallary/addLargeBanner");
const addSmallbanner_1 = require("../controllers/gallary/addSmallbanner");
const fetchGallaryDetails_1 = require("../controllers/gallary/fetchGallaryDetails");
exports.gallary = express_1.default.Router();
exports.gallary.post('/addLargeBanner', addLargeBanner_1.addLargeBanner);
exports.gallary.post('/addSmallBanner', addSmallbanner_1.addSmallBanner);
exports.gallary.post('/addCommunityPic', addCommunityPic_1.addCommunityPic);
exports.gallary.get('/getAllGallaryDetails', fetchGallaryDetails_1.gallaryDetails);
