"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.company = void 0;
const express_1 = __importDefault(require("express"));
const createCompany_1 = require("../controllers/company/createCompany");
const getCompanyDetails_1 = require("../controllers/company/getCompanyDetails");
exports.company = express_1.default.Router();
exports.company.post('/newCompany', createCompany_1.createCompany);
exports.company.get('/companyDetails', getCompanyDetails_1.getCompanyDetails);
