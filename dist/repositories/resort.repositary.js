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
const resort_model_1 = __importDefault(require("../models/resort.model"));
const baseRepositary_1 = require("./baseRepositary");
const mongodb_1 = require("mongodb");
class ResortRepositary extends baseRepositary_1.BaseRepository {
    ///////////////////////////// creating a single resort with all the information passed from front end//////////////////
    constructor() {
        super(resort_model_1.default);
    }
    // async createResort(resortDetails: IResort): Promise<IResort> {
    //     return await this.create<IResort>(resortDetails);
    // }
    editResort(resortDetails, resortId, image) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield resort_model_1.default.updateOne({ _id: new mongodb_1.ObjectId(resortId) }, {
                $set: Object.assign(Object.assign({ "resortDetails.name": resortDetails.name, "resortDetails.heading": resortDetails.heading, "resortDetails.description": resortDetails.description }, (image ? { "resortDetails.image": image } : {})), { "resortDetails.features": resortDetails.features, location: resortDetails.location, email: resortDetails.email, customerCareNo: resortDetails.customerCareNo }),
            });
        });
    }
    editResortActive(resortId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield resort_model_1.default.updateOne({ _id: new mongodb_1.ObjectId(resortId) }, [{ $set: { active: { $not: ["$active"] } } }]);
        });
    }
    // pushing new room that is being created
    addingRoomInResort(roomId, resortId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield resort_model_1.default.updateOne({ _id: resortId }, { $push: { rooms: roomId } });
        });
    }
    ////////////////////////////// updating gallary id after creating gallary model in the database////////////
    setGallaryId(resortId, gallaryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const gallaryid = gallaryId.valueOf().toString(); // doubt
            return yield resort_model_1.default.updateOne({ _id: new mongodb_1.ObjectId(resortId) }, { $set: { gallaryId: gallaryid } });
        });
    }
    addManger(resortId, managerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield resort_model_1.default.updateOne({ _id: resortId }, { $set: { manager: managerId } });
        });
    }
    deleteManager(resortId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield resort_model_1.default.updateOne({ _id: resortId }, { $unset: { manager: '' } });
        });
    }
    getResortByManagerId(managerId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield resort_model_1.default.findOne({ manager: managerId });
        });
    }
    searchSortService(searchValue, sortOrder) {
        return __awaiter(this, void 0, void 0, function* () {
            //************************************ major error will change later */
            let query = resort_model_1.default.find({ "resortDetails.name": { $regex: new RegExp(searchValue ? searchValue : '', 'i') } }).populate('manager');
            if (sortOrder) {
                query = query.sort({ "resortDetails.name": sortOrder });
            }
            return yield query;
        });
    }
    populatedResortDetailsOfManager(resortId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield resort_model_1.default.findOne({ _id: resortId }).populate("manager");
        });
    }
}
exports.default = ResortRepositary;
