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
const resort_model_1 = __importDefault(require("../models/resort.model"));
class ResortRepositary {
    ///////////////////////////// creating a single resort with all the information passed from front end//////////////////
    createResort(resortDetails, location, email, customerCareNo) {
        return __awaiter(this, void 0, void 0, function* () {
            const resort = new resort_model_1.default({
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
            });
            yield resort.save();
            return resort.toJSON();
        });
    }
    ////////////////////////////// querying for all resorts information ////////////////////////
    getAllresortDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            const resort = yield resort_model_1.default.find();
            return resort ? resort : null;
        });
    }
    ///////////////////////////// querying for single resort details which contains of name, heading, description, image//////
    // this query was created to check for name duplication since name property is unique in database.
    // so since we know that we manually throw an error inside here. not sure if we will use it.
    // somewhere else if yes u should remove this manual error
    searchResort(resortdetail) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const resort = yield resort_model_1.default.findOne({
                    resortDetails: resortdetail,
                });
                return resort ? resort.toJSON() : null;
            }
            catch (error) {
                throw errorResponse_1.default.internalError("Resort with the same name aldready exist"); /// doubt1 why can't I manually throw an error knowing that mongodb will throw and error. the mongodb error is directly going to global catch
            }
        });
    }
    ////////////////////////////// querying resort by its id /////////////////////////////
    findResortById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const resort = yield resort_model_1.default.findById(id);
            return resort ? resort.toJSON() : null;
        });
    }
    ////////////////////////////// updating gallary id after creating gallary model in the database////////////
    setGallaryId(resortId, gallaryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const gallaryid = gallaryId.valueOf().toString();
            const resort = yield resort_model_1.default.updateOne({ _id: resortId }, { $set: { gallaryId: gallaryid } });
            return resort ? resort.acknowledged : null;
        });
    }
}
exports.default = ResortRepositary;
