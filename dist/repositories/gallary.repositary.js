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
const resortGallary_model_1 = __importDefault(require("../models/resortGallary.model"));
const mongodb_1 = require("mongodb");
const baseRepositary_1 = require("./baseRepositary");
// import ObjectId from "mong"
class GallaryRepositary extends baseRepositary_1.BaseRepository {
    constructor() {
        super(resortGallary_model_1.default);
    }
    createGallary(resortId) {
        return __awaiter(this, void 0, void 0, function* () {
            const newGallary = {
                resortid: new mongodb_1.ObjectId(resortId),
            };
            return this.create(newGallary);
        });
    }
    editGallaryStatus(resortId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield resortGallary_model_1.default.updateOne({ resortid: new mongodb_1.ObjectId(resortId) }, [{ $set: { active: { $not: ["$active"] } } }]);
        });
    }
    addBanner(type, image, description1, description2, resortId) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = type === "largeBanner" ? "largeBanner" : "smallBanner";
            return yield resortGallary_model_1.default.findOneAndUpdate({ resortid: new mongodb_1.ObjectId(resortId) }, {
                $addToSet: {
                    [key]: {
                        image: image,
                        description1: description1,
                        description2: description2,
                    },
                },
            }, { new: true });
        });
    }
    deleteBannerbyId(type, resortId, bannerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = type === "largeBanner" ? "largeBanner" : "smallBanner";
            return yield resortGallary_model_1.default.findOneAndUpdate({ resortid: new mongodb_1.ObjectId(resortId) }, {
                $pull: {
                    [key]: {
                        _id: new mongodb_1.ObjectId(bannerId),
                    },
                },
            }, { new: true });
        });
    }
    editBannerDetails(type, resortId, bannerId, description1, description2) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = type === "largeBanner" ? "largeBanner" : "smallBanner";
            return yield resortGallary_model_1.default.findOneAndUpdate({
                resortid: new mongodb_1.ObjectId(resortId),
                [`${key}._id`]: new mongodb_1.ObjectId(bannerId),
            }, {
                $set: {
                    [`${key}.$.description1`]: description1,
                    [`${key}.$.description2`]: description2,
                },
            }, { new: true });
        });
    }
    editBannerImage(type, resortId, bannerId, image) {
        return __awaiter(this, void 0, void 0, function* () {
            const key = type === "largeBanner" ? "largeBanner" : "smallBanner";
            return yield resortGallary_model_1.default.findOneAndUpdate({
                resortid: new mongodb_1.ObjectId(resortId),
                [`${key}._id`]: new mongodb_1.ObjectId(bannerId),
            }, {
                $set: {
                    [`${key}.$.image`]: image,
                },
            }, { new: true });
        });
    }
    addCommunityPic(resortId, image) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield resortGallary_model_1.default.findOneAndUpdate({ resortid: new mongodb_1.ObjectId(resortId) }, {
                $addToSet: {
                    communityPics: image,
                },
            }, { new: true });
        });
    }
    deleteCommunityPic(resortId, image) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield resortGallary_model_1.default.findOneAndUpdate({
                resortid: new mongodb_1.ObjectId(resortId),
            }, {
                $pull: {
                    communityPics: image,
                },
            }, { new: true });
        });
    }
    editCommunityPic(resortId, index, newImage) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield resortGallary_model_1.default.findOneAndUpdate({ resortid: new mongodb_1.ObjectId(resortId) }, {
                $set: {
                    [`communityPics.${index}`]: newImage,
                },
            }, { new: true });
        });
    }
    findGallaryByResortId(resortId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield resortGallary_model_1.default.findOne({
                resortid: new mongodb_1.ObjectId(resortId),
            });
        });
    }
}
exports.default = GallaryRepositary;
