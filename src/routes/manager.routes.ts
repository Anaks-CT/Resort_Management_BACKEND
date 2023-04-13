import express from 'express';
import { validateLogin, validateSignup } from '../middlewares/bodyValidation';
import { login, signup } from '../controllers/manager/auth';
import { getAllManagerDetails } from '../controllers/manager/managerCRUD';

export const manager = express.Router();

manager.get('/',getAllManagerDetails)
manager.post('/signup',validateSignup, signup);
manager.post('/login',validateLogin, login)