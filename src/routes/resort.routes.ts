import express from 'express';
import { createResort } from '../controllers/resort/createResort';
import { getAllResortDetails } from '../controllers/resort/getAllResortDetails';

export const resort = express.Router();

resort.post('/newResort', createResort);
resort.get('/getAllResortDetails', getAllResortDetails);

