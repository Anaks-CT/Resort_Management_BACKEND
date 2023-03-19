"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resort = void 0;
const express_1 = __importDefault(require("express"));
const createResort_1 = require("../controllers/resort/createResort");
exports.resort = express_1.default.Router();
exports.resort.post('/newResort', createResort_1.createResort);
