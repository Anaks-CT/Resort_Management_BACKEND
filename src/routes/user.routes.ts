import express from 'express';
import { login } from '../controllers/user/auth/login';
import { signup } from '../controllers/user/auth/signup';

export const user = express.Router();

user.post('/signup', signup);
user.post('/login', login)
