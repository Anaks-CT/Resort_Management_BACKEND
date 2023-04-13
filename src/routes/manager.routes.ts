import express from 'express';
import { managerSignupValidate, validateLogin } from '../middlewares/bodyValidation';
import { login, signup } from '../controllers/manager/auth';
import { changeManagerStatus, getAllManagerDetails } from '../controllers/manager/managerCRUD';

export const manager = express.Router();

manager.route('/').get(getAllManagerDetails).delete(changeManagerStatus)
manager.post('/signup',managerSignupValidate, signup);
manager.post('/login',validateLogin, login)