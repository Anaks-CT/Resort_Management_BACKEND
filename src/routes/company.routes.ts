import express from "express";
import { addFaq, deleteFaq, editFaq, faq } from "../controllers/company/faq";
import { adminLogin } from "../controllers/company/adminLogin";
import { createCompany } from "../controllers/company/createCompany";
import { getCompanyDetails } from "../controllers/company/getCompanyDetails";
import { faqValidate, validateLogin } from "../middlewares/bodyValidation";
import { adminVerify } from "../middlewares/auth-middlewares";

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
