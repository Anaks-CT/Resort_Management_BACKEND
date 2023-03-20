import express from 'express';
import { addFaq } from '../controllers/company/addFaq';
import { createCompany } from '../controllers/company/createCompany';
import { getCompanyDetails } from '../controllers/company/getCompanyDetails';

export const company = express.Router();

company.post('/newCompany', createCompany);
company.get('/companyDetails', getCompanyDetails);
company.post('/addFaq', addFaq);

