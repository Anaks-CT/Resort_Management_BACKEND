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
const company_model_1 = __importDefault(require("../models/company.model"));
const baseRepositary_1 = require("./baseRepositary");
class CompanyRepositary extends baseRepositary_1.BaseRepository {
    constructor() {
        super(company_model_1.default);
    }
    createCompany(company) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.create(company);
        });
    }
    getCompanyDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            return yield this.getOne();
        });
    }
    addFaqs(Q, A) {
        return __awaiter(this, void 0, void 0, function* () {
            const result = yield company_model_1.default.updateOne({}, { $addToSet: { faqs: { Q: Q, A: A } } });
            return result.acknowledged;
        });
    }
    searchSingleFaq(faqs) {
        return __awaiter(this, void 0, void 0, function* () {
            const existingFAQ = yield company_model_1.default
                .findOne({ faqs: { $elemMatch: { Q: faqs.Q } } })
                .exec();
            return existingFAQ;
        });
    }
    addResortId(resortId) {
        return __awaiter(this, void 0, void 0, function* () {
            const updateResortIdResponse = yield company_model_1.default.updateOne({}, { $addToSet: { resortDetails: resortId } });
            return updateResortIdResponse.acknowledged;
        });
    }
}
exports.default = CompanyRepositary;
