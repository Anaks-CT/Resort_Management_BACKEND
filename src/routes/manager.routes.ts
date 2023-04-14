import express from 'express';
import { managerSignupValidate, paramsIdValidate, validateLogin } from '../middlewares/bodyValidation';
import { login, signup } from '../controllers/manager/auth';
import { changeManagerStatus, getAllManagerDetails } from '../controllers/manager/managerCRUD';

export const manager = express.Router();

manager.route('/:id?').get(getAllManagerDetails).delete(paramsIdValidate,changeManagerStatus)
manager.post('/signup',managerSignupValidate, signup);
manager.post('/login',validateLogin, login)