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
const auth_middlewares_1 = require("../middlewares/auth-middlewares");
exports.resort = express_1.default.Router();
exports.resort
    .route("/resort/:resortId?")
    .get(getAllResortDetails_1.getAllResortDetails)
    .post(auth_middlewares_1.adminVerify, bodyValidation_1.resortValidate, resortCRUD_1.createResort)
    .put(auth_middlewares_1.adminVerify, resortCRUD_1.editResort)
    .delete(auth_middlewares_1.adminVerify, resortCRUD_1.editResortActive);
exports.resort.get('/resortDetailService', getAllResortDetails_1.getSearchSortResortDetails);
exports.resort.post("/getResortById/:resortId", getAllResortDetails_1.getSingleResort);
