import express from "express";
import { addFaq, deleteFaq, editFaq, faq } from "../controllers/company/faq";
import { adminLogin } from "../controllers/company/adminLogin";
import { createCompany } from "../controllers/company/createCompany";
import { getCompanyDetails } from "../controllers/company/getCompanyDetails";
import { faqValidate, validateLogin } from "../middlewares/bodyValidation";

export const company = express.Router();

company.post("/newCompany", createCompany);
company.get("/companyDetails", getCompanyDetails);
// company.post('/addFaq', addFaq);
company.post("/adminLogin", validateLogin, adminLogin);
company
    .route("/faq/:id?")
    .get(faq)
    .post(faqValidate, addFaq)
    .delete(deleteFaq)
    .put(faqValidate, editFaq);
