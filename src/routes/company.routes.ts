import express from "express";
import { addFaq, deleteFaq, editFaq, faq } from "../controllers/company/faq";
import { adminLogin } from "../controllers/company/adminLogin";
import { createCompany } from "../controllers/company/createCompany";
import { getCompanyDetails } from "../controllers/company/getCompanyDetails";
import { faqValidate, paramsIdValidate, validateLogin } from "../middlewares/bodyValidation";
import { adminVerify } from "../middlewares/auth-middlewares";
import { getAdminDashboardDetails, getResortDashboardDetails } from "../controllers/company/dashboardCRUD";

export const company = express.Router();

company.post("/newCompany", adminVerify, createCompany);
company.get("/companyDetails", getCompanyDetails);
// company.post('/addFaq', addFaq);
company.post("/adminLogin", validateLogin, adminLogin);
company
    .route("/faq/:id?")
    .get(faq)
    .post(adminVerify,faqValidate, addFaq)
    .delete(adminVerify,deleteFaq)
    .put(adminVerify,faqValidate, editFaq);

company.route('/adminDashboardDetails').get(adminVerify, getAdminDashboardDetails)
company.route('/resortDashboard/:id').get(adminVerify, paramsIdValidate, getResortDashboardDetails)