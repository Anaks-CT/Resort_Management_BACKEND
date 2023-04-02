"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.editBannerImage = exports.editBannerDetails = exports.deleteBanner = exports.addBanner = void 0;
const gallary_service_1 = __importDefault(require("../../services/gallary.service"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const gallaryService = new gallary_service_1.default();
exports.addBanner = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { image, description1, description2, banner } = req.body;
    const { resortId } = req.params;
    const updatedData = yield gallaryService.addBanner(banner, image, description1, description2, resortId);
    res.json({ message: "Banner added successfully", data: updatedData });
}));
exports.deleteBanner = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { resortId, largeBannerId, smallBannerId } = req.params;
    const banner = req.params
        .banner;
    const updatedData = yield gallaryService.deleteBanner(banner, resortId, banner === "largeBanner" ? largeBannerId : smallBannerId);
    res.json({ message: "Image deleted successfully", data: updatedData });
}));
exports.editBannerDetails = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { resortId, largeBannerId, smallBannerId } = req.params;
    const { description1, description2, banner } = req.body;
    const updatedData = yield gallaryService.editBannerDetails(banner, resortId, banner === "largeBanner" ? largeBannerId : smallBannerId, description1, description2);
    res.json({ message: "Banner Details edited successfully", data: updatedData });
}));
exports.editBannerImage = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { resortId, largeBannerId, smallBannerId } = req.params;
    const { image, banner } = req.body;
    const updatedData = yield gallaryService.editBannerImage(banner, resortId, banner === "largeBanner" ? largeBannerId : smallBannerId, image);
    res.json({ message: "Banner image edited successfully", data: updatedData });
}));
