import express from 'express';
import { managerSignupValidate, paramsIdValidate, validateLogin } from '../middlewares/bodyValidation';
import { login, signup } from '../controllers/manager/auth';
import { changeManagerStatus, getAllManagerDetails, getManagerDetailsByResortId } from '../controllers/manager/managerCRUD';
import { adminVerify, managerVerify } from '../middlewares/auth-middlewares';
import { getManagerDashboardDetails } from '../controllers/manager/dashboardCRUD';
// import { getManagerDashboardDetails } from '../controllers/manager/dashboardC    RUD';

export const manager = express.Router();

manager.post('/signup',adminVerify,managerSignupValidate, signup);
manager.post('/login',validateLogin, login)
manager.get('/resortMangers:id',paramsIdValidate, getManagerDetailsByResortId)
manager.get('/dashboardDetails',managerVerify, getManagerDashboardDetails)



manager.route('/:id?').get(adminVerify, getAllManagerDetails).delete(adminVerify, paramsIdValidate,changeManagerStatus)