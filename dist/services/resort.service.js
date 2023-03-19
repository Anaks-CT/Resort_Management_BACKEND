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
const resortGallary_model_1 = __importDefault(require("../models/resortGallary.model"));
class ResortService {
    constructor(resortRepositary = new resort_repositary_1.default()) {
        this.resortRepositary = resortRepositary;
    }
    createResort(resortDetails, location, email, customerCareNo) {
        return __awaiter(this, void 0, void 0, function* () {
            const resortDupe = yield this.resortRepositary.searchResort(resortDetails);
            /////////////////////// checking duplicate resort with same name///////////////////////////////
            if (resortDupe) {
                throw errorResponse_1.default.badRequest("Resort aldready exists");
            }
            //////////////////////// creating new resort ////////////////////////
            const resort = yield this.resortRepositary.createResort(resortDetails, location, email, customerCareNo);
            ///////////////////////// creating gallary modal for the resort //////////////////////
            const gallary = new resortGallary_model_1.default({
                resortid: resort._id,
            });
            ////////////////////////// updating the created gallaryid in resort schema/////////////////////
            yield this.resortRepositary.setGallaryId(resort._id, gallary._id);
            yield gallary.save();
            return { resort };
        });
    }
    allResortDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            const resort = yield this.resortRepositary.getAllresortDetails();
            if (!resort) {
                throw errorResponse_1.default.badRequest("Resorts not found");
            }
            return resort;
        });
    }
}
exports.default = ResortService;
