"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.company = void 0;
const express_1 = __importDefault(require("express"));
const faq_1 = require("../controllers/company/faq");
const adminLogin_1 = require("../controllers/company/adminLogin");
const createCompany_1 = require("../controllers/company/createCompany");
const getCompanyDetails_1 = require("../controllers/company/getCompanyDetails");
const bodyValidation_1 = require("../middlewares/bodyValidation");
const auth_middlewares_1 = require("../middlewares/auth-middlewares");
const dashboardCRUD_1 = require("../controllers/company/dashboardCRUD");
exports.company = express_1.default.Router();
exports.company.post("/newCompany", auth_middlewares_1.adminVerify, createCompany_1.createCompany);
exports.company.get("/companyDetails", getCompanyDetails_1.getCompanyDetails);
// company.post('/addFaq', addFaq);
exports.company.post("/adminLogin", bodyValidation_1.validateLogin, adminLogin_1.adminLogin);
exports.company
    .route("/faq/:id?")
    .get(faq_1.faq)
    .post(auth_middlewares_1.adminVerify, bodyValidation_1.faqValidate, faq_1.addFaq)
    .delete(auth_middlewares_1.adminVerify, faq_1.deleteFaq)
    .put(auth_middlewares_1.adminVerify, bodyValidation_1.faqValidate, faq_1.editFaq);
exports.company.route('/adminDashboardDetails').get(auth_middlewares_1.adminVerify, dashboardCRUD_1.getAdminDashboardDetails);
exports.company.route('/resortDashboard/:id').get(auth_middlewares_1.adminVerify, bodyValidation_1.paramsIdValidate, dashboardCRUD_1.getResortDashboardDetails);
