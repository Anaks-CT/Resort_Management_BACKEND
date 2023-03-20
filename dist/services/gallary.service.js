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
const gallary_repositary_1 = __importDefault(require("../repositories/gallary.repositary"));
class GallaryService {
    constructor(gallaryRepositary = new gallary_repositary_1.default()) {
        this.gallaryRepositary = gallaryRepositary;
    }
    addLargeBanner(image, description1, description2, resortId) {
        return __awaiter(this, void 0, void 0, function* () {
            // checking if the gallary is present and is not null
            const gallary = yield this.gallaryRepositary.findGallaryByResortId(resortId);
            if (!gallary)
                throw errorResponse_1.default.badRequest("Resortid passed doesn't match any resorts");
            //checking for image duplication
            gallary === null || gallary === void 0 ? void 0 : gallary.largeBanner.forEach((el) => {
                if (el.image === image)
                    throw errorResponse_1.default.badRequest("Banner aldready exist");
            });
            // adding the image
            const addImageResponse = yield this.gallaryRepositary.addLargeBanner(image, description1, description2, resortId);
            //throwing error Banner not added for some reason
            if (!addImageResponse) {
                throw errorResponse_1.default.internalError("Banner not added");
            }
            return addImageResponse;
        });
    }
    addCommunityPic(resortId, image) {
        return __awaiter(this, void 0, void 0, function* () {
            // checking if the gallary is present and the error is caught in the repositary
            const gallary = yield this.gallaryRepositary.findGallaryByResortId(resortId);
            if (!gallary)
                throw errorResponse_1.default.badRequest("Resortid passed doesn't match any resorts");
            //checking for image duplication
            gallary === null || gallary === void 0 ? void 0 : gallary.communityPics.forEach((el) => {
                if (el === image)
                    throw errorResponse_1.default.badRequest("Picture aldready exist");
            });
            //adding the picture
            const addImageResponse = yield this.gallaryRepositary.addCommunityPic(resortId, image);
            //throwing error in case picture not added for some reason
            if (!addImageResponse) {
                throw errorResponse_1.default.internalError("Banner not added");
            }
            return addImageResponse;
        });
    }
    addSmallBanner(image, description1, description2, resortId) {
        return __awaiter(this, void 0, void 0, function* () {
            // checking if the gallary is present and the error is caught in the repositary
            const gallary = yield this.gallaryRepositary.findGallaryByResortId(resortId);
            if (!gallary)
                throw errorResponse_1.default.badRequest("Resortid passed doesn't match any resorts");
            //checking for image duplication
            gallary === null || gallary === void 0 ? void 0 : gallary.smallBanner.forEach((el) => {
                if (el.image === image)
                    throw errorResponse_1.default.badRequest("Banner aldready exist");
            });
            // adding the image
            const addImageResponse = yield this.gallaryRepositary.addSmallBanner(image, description1, description2, resortId);
            // throwing error if banner not added for some reason
            if (!addImageResponse) {
                throw errorResponse_1.default.internalError("Banner not added");
            }
            return addImageResponse;
        });
    }
    gallaryDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            const gallaryDetails = yield this.gallaryRepositary.GallaryDetails();
            if (!gallaryDetails)
                throw errorResponse_1.default.badRequest("Gallary database is empty");
            return gallaryDetails;
        });
    }
}
exports.default = GallaryService;
