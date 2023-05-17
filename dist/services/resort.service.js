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
const resort_repositary_1 = __importDefault(require("../repositories/resort.repositary"));
const errorResponse_1 = __importDefault(require("../error/errorResponse"));
const gallary_repositary_1 = __importDefault(require("../repositories/gallary.repositary"));
const company_repositary_1 = __importDefault(require("../repositories/company.repositary"));
class ResortService {
    constructor(resortRepositary = new resort_repositary_1.default(), gallaryRepositary = new gallary_repositary_1.default(), companyRepositary = new company_repositary_1.default()) {
        this.resortRepositary = resortRepositary;
        this.gallaryRepositary = gallaryRepositary;
        this.companyRepositary = companyRepositary;
    }
    createResort(resortDetails, location, email, customerCareNo) {
        return __awaiter(this, void 0, void 0, function* () {
            const resortDupe = yield this.resortRepositary.getOne({ resortDetails: resortDetails });
            /////////////////////// checking duplicate resort with same name///////////////////////////////
            if (resortDupe) {
                throw errorResponse_1.default.badRequest("Resort aldready exists");
            }
            //////////////////////// creating new resort ////////////////////////
            const newResort = {
                resortDetails: {
                    name: resortDetails.name,
                    heading: resortDetails.heading,
                    description: resortDetails.description,
                    image: resortDetails.image,
                    features: resortDetails.features,
                },
                location: location,
                email: email,
                customerCareNo: customerCareNo,
            };
            const resort = yield this.resortRepositary.create(newResort);
            ///////////////////////// adding the newly created resort in to company  /////////////////
            yield this.companyRepositary.addResortId(resort._id);
            ///////////////////////// creating gallary modal for the resort //////////////////////
            const gallary = yield this.gallaryRepositary.createGallary(resort._id);
            if (!gallary)
                throw errorResponse_1.default.internalError("gallary is not created. Error occured in the database");
            ////////////////////////// updating the created gallaryid in resort schema/////////////////////
            yield this.resortRepositary.setGallaryId(resort._id, gallary._id);
            return { resort };
        });
    }
    getActiveMangerOfResort(resortId) {
        return __awaiter(this, void 0, void 0, function* () {
            const populatedResortDetails = this.resortRepositary.populatedResortDetailsOfManager(resortId);
            if (!populatedResortDetails)
                throw errorResponse_1.default.notFound('No Resort details');
            return populatedResortDetails;
        });
    }
    editResort(resortDetails, image, resortId) {
        return __awaiter(this, void 0, void 0, function* () {
            const editResort = yield this.resortRepositary.editResort(resortDetails, resortId, image);
            if ((editResort === null || editResort === void 0 ? void 0 : editResort.modifiedCount) !== 1)
                throw errorResponse_1.default.internalError('Resort not edited');
            return editResort;
        });
    }
    editResortActive(resortId) {
        return __awaiter(this, void 0, void 0, function* () {
            const editResponse = yield this.resortRepositary.editResortActive(resortId);
            const editGallaryStatus = yield this.gallaryRepositary.editGallaryStatus(resortId);
            if (editResponse.modifiedCount !== 1 || editGallaryStatus.modifiedCount !== 1)
                throw errorResponse_1.default.internalError('Resort Active is not changed');
            return editResponse;
        });
    }
    allResortDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            const resort = yield this.resortRepositary.getAll({});
            if (resort.length < 1)
                throw errorResponse_1.default.badRequest("Resorts not found");
            return resort;
        });
    }
    searchSortService(searchValue, sortOrder) {
        return __awaiter(this, void 0, void 0, function* () {
            let order;
            if (sortOrder === "asc") {
                order = 1;
            }
            else if (sortOrder === "des") {
                order = -1;
            }
            else {
                order = null;
            }
            const resortDetails = yield this.resortRepositary.searchSortService(searchValue, order);
            if (!resortDetails)
                throw errorResponse_1.default.internalError('Resorts not found');
            return resortDetails;
        });
    }
    getResortCount() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.resortRepositary.count();
        });
    }
    getResortById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const resort = yield this.resortRepositary.getById(id);
            if (!resort)
                throw errorResponse_1.default.badRequest("Resort not found");
            return resort;
        });
    }
    getResortByManagerId(managerId) {
        return __awaiter(this, void 0, void 0, function* () {
            const resortDetails = yield this.resortRepositary.getResortByManagerId(managerId);
            if (!resortDetails)
                throw errorResponse_1.default.notFound('Resort Not Found');
            return resortDetails;
        });
    }
}
exports.default = ResortService;
