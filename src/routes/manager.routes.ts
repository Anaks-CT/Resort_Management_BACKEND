import express from 'express';
import { managerSignupValidate, paramsIdValidate, validateLogin } from '../middlewares/bodyValidation';
import { login, signup } from '../controllers/manager/auth';
import { changeManagerStatus, getAllManagerDetails, getDashboardDetails, getManagerDetailsByResortId } from '../controllers/manager/managerCRUD';
import { adminVerify } from '../middlewares/auth-middlewares';

export const manager = express.Router();

manager.post('/signup',adminVerify,managerSignupValidate, signup);
manager.post('/login',validateLogin, login)
manager.route('/:id?').get(getAllManagerDetails).delete(paramsIdValidate,changeManagerStatus)
manager.get('resortMangers:id',paramsIdValidate, getManagerDetailsByResortId)