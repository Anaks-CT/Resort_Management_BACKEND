"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.gallary = void 0;
const express_1 = __importDefault(require("express"));
const addLargeBanner_1 = require("../controllers/gallary/addLargeBanner");
const addSmallbanner_1 = require("../controllers/gallary/addSmallbanner");
exports.gallary = express_1.default.Router();
exports.gallary.post('/addLargeBanner', addLargeBanner_1.addLargeBanner);
exports.gallary.post('/addLargeBanner', addSmallbanner_1.addSmallBanner);
