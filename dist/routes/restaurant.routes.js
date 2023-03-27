"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restaurant = void 0;
const express_1 = __importDefault(require("express"));
const createRestaurant_1 = require("../controllers/restaurant/createRestaurant");
exports.restaurant = express_1.default.Router();
exports.restaurant.post('/createRestaurant', createRestaurant_1.createRestaurant);
