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
const manager_model_1 = __importDefault(require("../models/manager.model"));
const baseRepositary_1 = require("./baseRepositary");
class MangerRepositary extends baseRepositary_1.BaseRepository {
    constructor() {
        super(manager_model_1.default);
    }
    blockingAllExistingMangerOfResort(resortId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield manager_model_1.default.updateMany({ resortId: resortId }, { $set: { active: false } });
        });
    }
    updateManagerStatus(resortId, email) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield manager_model_1.default.updateOne({ resortId: resortId, email: email }, [{ $set: { active: { $not: ["$active"] } } }]);
        });
    }
    // async getPopulatedResortDetails(): Promise<IManager[] | null >{
    //   return await managerModel.find().populate('resortId')
    // }
    searchSortManagerDetails(searchValue, sortOrder, sortBy) {
        return __awaiter(this, void 0, void 0, function* () {
            //************************************ major error will change later */
            let query = manager_model_1.default.find({ "email": { $regex: new RegExp(searchValue ? searchValue : '', 'i') } }).populate('resortId');
            if (sortOrder) {
                query = query.sort({ [sortBy]: sortOrder });
            }
            return yield query;
        });
    }
}
exports.default = MangerRepositary;
