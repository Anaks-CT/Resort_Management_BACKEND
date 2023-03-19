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
exports.createCompany = void 0;
const company_service_1 = __importDefault(require("../../services/company.service"));
const companyService = new company_service_1.default();
const createCompany = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { companyName, bannerDetails, faqs } = req.body;
    try {
        const response = yield companyService.createCompany(companyName, bannerDetails, faqs);
        res.send({ message: "new company created", data: response });
    }
    catch (error) {
        return next(error);
    }
});
exports.createCompany = createCompany;
