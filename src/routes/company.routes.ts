import express from 'express';
import { addFaq } from '../controllers/company/addFaq';
import { adminLogin } from '../controllers/company/adminLogin';
import { createCompany } from '../controllers/company/createCompany';
import { getCompanyDetails } from '../controllers/company/getCompanyDetails';
import { validateLogin } from '../middlewares/bodyValidation';

export const company = express.Router();

company.post('/newCompany', createCompany);
company.get('/companyDetails', getCompanyDetails);
company.post('/addFaq', addFaq);
company.post('/adminLogin',validateLogin, adminLogin)
