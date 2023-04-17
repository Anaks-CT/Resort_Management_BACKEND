import express from 'express';
import { login } from '../controllers/user/auth/login';
import { signup } from '../controllers/user/auth/signup';
import { validateLogin, validateSignup } from '../middlewares/bodyValidation';

export const user = express.Router();

user.post('/signup',validateSignup, signup);
user.post('/login',validateLogin, login)