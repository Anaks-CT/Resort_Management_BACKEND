"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resort = void 0;
const express_1 = __importDefault(require("express"));
const createResort_1 = require("../controllers/resort/createResort");
const getAllResortDetails_1 = require("../controllers/resort/getAllResortDetails");
exports.resort = express_1.default.Router();
exports.resort.post('/newResort', createResort_1.createResort);
exports.resort.get('/getAllResortDetails', getAllResortDetails_1.getAllResortDetails);
exports.resort.post('/getResortById/:resortId', getAllResortDetails_1.getSingleResort);
