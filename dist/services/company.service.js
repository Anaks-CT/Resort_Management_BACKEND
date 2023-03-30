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
const company_repositary_1 = __importDefault(require("../repositories/company.repositary"));
class CompanyService {
    constructor(companyRepositary = new company_repositary_1.default()) {
        this.companyRepositary = companyRepositary;
    }
    createCompany(companyName, bannerDetails, circleBanners, faqs) {
        return __awaiter(this, void 0, void 0, function* () {
            const company = {
                companyName: companyName,
                bannerDetails: bannerDetails,
                circleBanners: circleBanners,
                faqs: faqs,
            };
            const addCompany = yield this.companyRepositary.createCompany(company);
            return addCompany;
        });
    }
    getCompanyDetails() {
        return __awaiter(this, void 0, void 0, function* () {
            const companyDetails = yield this.companyRepositary.getCompanyDetails();
            if (!companyDetails)
                throw errorResponse_1.default.internalError('company not found');
            return companyDetails;
        });
    }
    addFaq(Q, A) {
        return __awaiter(this, void 0, void 0, function* () {
            //// checking for image duplication
            const checkFaqDup = yield this.companyRepositary.searchSingleFaq({ Q, A });
            if (checkFaqDup)
                throw errorResponse_1.default.internalError('faq aldready exist');
            const addFaq = yield this.companyRepositary.addFaqs(Q, A);
            return addFaq;
        });
    }
}
exports.default = CompanyService;
