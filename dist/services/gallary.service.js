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
    addBanner(type, image, description1, description2, resortId) {
        return __awaiter(this, void 0, void 0, function* () {
            // checking if the gallary is present and is not null
            const gallary = yield this.gallaryRepositary.findGallaryByResortId(resortId);
            if (!gallary)
                throw errorResponse_1.default.badRequest("Resortid passed doesn't match any resorts");
            //checking for image duplication
            if (type === "largeBanner") {
                gallary === null || gallary === void 0 ? void 0 : gallary.largeBanner.forEach((el) => {
                    if (el.image === image)
                        throw errorResponse_1.default.badRequest("Banner aldready exist");
                });
            }
            else if (type === "smallBanner") {
                gallary === null || gallary === void 0 ? void 0 : gallary.smallBanner.forEach((el) => {
                    if (el.image === image)
                        throw errorResponse_1.default.badRequest("Banner aldready exist");
                });
            }
            // adding the image
            const addImageResponse = yield this.gallaryRepositary.addBanner(type, image, description1, description2, resortId);
            //throwing error Banner not added for some reason
            if (!addImageResponse) {
                throw errorResponse_1.default.internalError("Banner not added");
            }
            return addImageResponse;
        });
    }
    deleteBanner(type, resortId, bannerId) {
        return __awaiter(this, void 0, void 0, function* () {
            //*************************dont forget to write the return tupe of this******************** //
            const deleteLargeBanner = this.gallaryRepositary.deleteBannerbyId(type, resortId, bannerId);
            if (!deleteLargeBanner)
                throw errorResponse_1.default.badRequest('Banner not deleted');
            return deleteLargeBanner;
        });
    }
    editBannerDetails(type, resortId, bannerId, description1, description2) {
        return __awaiter(this, void 0, void 0, function* () {
            const editResponse = this.gallaryRepositary.editBannerDetails(type, resortId, bannerId, description1, description2);
            if (!editResponse)
                throw errorResponse_1.default.badRequest('Banner not edited');
            return editResponse;
        });
    }
    editBannerImage(type, resortId, bannerId, image) {
        return __awaiter(this, void 0, void 0, function* () {
            const editResponse = this.gallaryRepositary.editBannerImage(type, resortId, bannerId, image);
            if (!editResponse)
                throw errorResponse_1.default.badRequest('Banner not edited');
            return editResponse;
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
    gallaryDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            const gallaryDetails = yield this.gallaryRepositary.GallaryDetails();
            if (!gallaryDetails)
                throw errorResponse_1.default.badRequest("Gallary database is empty");
            return gallaryDetails;
        });
    }
    findGallarybyResortId(resortId) {
        return __awaiter(this, void 0, void 0, function* () {
            const gallaryDetails = yield this.gallaryRepositary.findGallaryByResortId(resortId);
            if (!gallaryDetails)
                throw errorResponse_1.default.badRequest("Cannot find Gallary");
            return gallaryDetails;
        });
    }
}
exports.default = GallaryService;
