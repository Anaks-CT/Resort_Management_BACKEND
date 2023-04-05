"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resort = void 0;
const express_1 = __importDefault(require("express"));
const resortCRUD_1 = require("../controllers/resort/resortCRUD");
const getAllResortDetails_1 = require("../controllers/resort/getAllResortDetails");
const bodyValidation_1 = require("../middlewares/bodyValidation");
exports.resort = express_1.default.Router();
// resort.post('/newResort', resortValidate, createResort);
exports.resort
    .route("/resort/:resortId?")
    .get(getAllResortDetails_1.getAllResortDetails)
    .post(bodyValidation_1.resortValidate, resortCRUD_1.createResort)
    .put(resortCRUD_1.editResort)
    .delete(resortCRUD_1.editResortActive);
exports.resort.post("/getResortById/:resortId", getAllResortDetails_1.getSingleResort);
