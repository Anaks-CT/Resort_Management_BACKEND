import express from 'express';
import { createResort } from '../controllers/resort/createResort';

export const resort = express.Router();

resort.post('/newResort', createResort);