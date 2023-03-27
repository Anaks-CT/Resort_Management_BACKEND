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
const errorResponse_1 = __importDefault(require("../error/errorResponse"));
const resortGallary_model_1 = __importDefault(require("../models/resortGallary.model"));
const ObjectId = require("mongodb").ObjectId;
class GallaryRepositary {
    createGallary(resortId) {
        return __awaiter(this, void 0, void 0, function* () {
            const gallary = new resortGallary_model_1.default({
                resortid: new ObjectId(resortId),
            });
            yield gallary.save();
            return gallary.toJSON();
        });
    }
    addLargeBanner(image, description1, description2, resortId) {
        return __awaiter(this, void 0, void 0, function* () {
            const addImage = yield resortGallary_model_1.default.updateOne({ resortid: new ObjectId(resortId) }, {
                $addToSet: {
                    largeBanner: {
                        image: image,
                        description1: description1,
                        description2: description2,
                    },
                },
            });
            return addImage.acknowledged;
        });
    }
    deleteLargeBannerbyId(resortId, largeBannerId) {
        return __awaiter(this, void 0, void 0, function* () {
            //****************** don't forget to write the return type of this***************************/
            const deleteResponse = yield resortGallary_model_1.default.updateOne({ resortid: new ObjectId(resortId) }, {
                $pull: {
                    largeBanner: {
                        _id: new ObjectId(largeBannerId),
                    },
                },
            });
            return deleteResponse;
        });
    }
    editLargeBannerDetails(resortId, largeBannerId, description1, description2) {
        return __awaiter(this, void 0, void 0, function* () {
            const editResponse = yield resortGallary_model_1.default.updateOne({
                resortid: new ObjectId(resortId),
                "largeBanner._id": new ObjectId(largeBannerId),
            }, {
                $set: {
                    "largeBanner.$.description1": description1,
                    "largeBanner.$.description2": description2,
                },
            });
            return editResponse;
        });
    }
    addCommunityPic(resortId, image) {
        return __awaiter(this, void 0, void 0, function* () {
            const addImage = yield resortGallary_model_1.default.updateOne({ resortid: new ObjectId(resortId) }, {
                $addToSet: {
                    communityPics: image,
                },
            });
            return addImage.acknowledged;
        });
    }
    addSmallBanner(image, description1, description2, resortId) {
        return __awaiter(this, void 0, void 0, function* () {
            const addImage = yield resortGallary_model_1.default.updateOne({ resortid: new ObjectId(resortId) }, {
                $addToSet: {
                    smallBanner: {
                        image: image,
                        description1: description1,
                        description2: description2,
                    },
                },
            });
            return addImage.acknowledged;
        });
    }
    findGallaryByResortId(resortId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const gallary = yield resortGallary_model_1.default.findOne({
                    resortid: new ObjectId(resortId),
                });
                return gallary ? gallary.toJSON() : null;
            }
            catch (error) {
                ///////////////////////////// if the id passed does not match with the mongoose id type////////////////////////
                // not sure if this is a good practice since mongodb might have thrown the error for something different error which wont be caught in the error. for example if we changed the details passing down
                throw errorResponse_1.default.internalError("ResortId is not of the type mongooose.objectID");
            }
        });
    }
    GallaryDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            const gallary = yield resortGallary_model_1.default.find();
            return gallary;
        });
    }
}
exports.default = GallaryRepositary;
