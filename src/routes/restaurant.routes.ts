import express from 'express';
import { createRestaurant } from '../controllers/restaurant/createRestaurant';


export const restaurant = express.Router();

restaurant.post('/createRestaurant', createRestaurant);
