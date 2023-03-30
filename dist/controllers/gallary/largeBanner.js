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
exports.editBannerImage = exports.editBannerDetails = exports.deleteLargeBanner = exports.addLargeBanner = void 0;
const gallary_service_1 = __importDefault(require("../../services/gallary.service"));
const gallaryService = new gallary_service_1.default();
const addLargeBanner = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { image, description1, description2 } = req.body;
    const { resortId } = req.params;
    try {
        const response = yield gallaryService.addBanner("largeBanner", image, description1, description2, resortId);
        const gallaryDetails = yield gallaryService.findGallarybyResortId(resortId);
        res.send({ message: "acknowledged:" + response, data: gallaryDetails });
    }
    catch (error) {
        return next(error);
    }
});
exports.addLargeBanner = addLargeBanner;
const deleteLargeBanner = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { resortId, largeBannerId } = req.params;
    try {
        const response = yield gallaryService.deleteBanner("largeBanner", resortId, largeBannerId);
        const gallaryDetails = yield gallaryService.findGallarybyResortId(resortId);
        res.send({ message: "acknowledged:" + response, data: gallaryDetails });
    }
    catch (err) {
        return next(err);
    }
});
exports.deleteLargeBanner = deleteLargeBanner;
const editBannerDetails = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { resortId, largeBannerId } = req.params;
    const { description1, description2 } = req.body;
    try {
        const response = yield gallaryService.editBannerDetails("largeBanner", resortId, largeBannerId, description1, description2);
        const gallaryDetails = yield gallaryService.findGallarybyResortId(resortId);
        res.send({ message: "acknowledged" + response, data: gallaryDetails });
    }
    catch (err) {
        return next(err);
    }
});
exports.editBannerDetails = editBannerDetails;
const editBannerImage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { resortId, largeBannerId } = req.params;
    const { image } = req.body;
    try {
        const response = yield gallaryService.editBannerImage("largeBanner", resortId, largeBannerId, image);
        const gallaryDetails = yield gallaryService.findGallarybyResortId(resortId);
        res.send({ message: "acknowledged" + response, data: gallaryDetails });
    }
    catch (err) {
        return next(err);
    }
});
exports.editBannerImage = editBannerImage;
