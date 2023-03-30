import express from 'express';
import { createResort } from '../controllers/resort/createResort';
import { getAllResortDetails, getSingleResort } from '../controllers/resort/getAllResortDetails';

export const resort = express.Router();

resort.post('/newResort', createResort);
resort.get('/getAllResortDetails', getAllResortDetails);
resort.post('/getResortById/:resortId', getSingleResort)
