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
            const resortDupe = yield this.resortRepositary.searchResort(resortDetails);
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
            const resort = yield this.resortRepositary.createResort(newResort);
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
    allResortDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            const resort = yield this.resortRepositary.getAllresortDetails();
            if (!resort)
                throw errorResponse_1.default.badRequest("Resorts not found");
            return resort;
        });
    }
    getResortById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const resort = yield this.resortRepositary.findResortById(id);
            if (!resort)
                throw errorResponse_1.default.badRequest("Resort not found");
            return resort;
        });
    }
}
exports.default = ResortService;
