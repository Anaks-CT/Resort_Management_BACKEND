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
class GallaryRepositary {
    addLargeBanner(image, description1, description2, resortId) {
        return __awaiter(this, void 0, void 0, function* () {
            const addImage = yield resortGallary_model_1.default.updateOne({ resortid: resortId }, {
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
    addSmallBanner(image, description1, description2, resortId) {
        return __awaiter(this, void 0, void 0, function* () {
            const addImage = yield resortGallary_model_1.default.updateOne({ resortid: resortId }, {
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
                const gallary = yield resortGallary_model_1.default.findOne({ resortid: resortId });
                return gallary ? gallary.toJSON() : null;
            }
            catch (error) {
                throw errorResponse_1.default.internalError("Can't find the Gallary of the required Resort" ///// doubt is it okay to write error in here
                );
            }
        });
    }
}
exports.default = GallaryRepositary;
