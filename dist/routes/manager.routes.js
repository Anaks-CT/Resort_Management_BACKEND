"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.manager = void 0;
const express_1 = __importDefault(require("express"));
const bodyValidation_1 = require("../middlewares/bodyValidation");
const auth_1 = require("../controllers/manager/auth");
const managerCRUD_1 = require("../controllers/manager/managerCRUD");
const auth_middlewares_1 = require("../middlewares/auth-middlewares");
const dashboardCRUD_1 = require("../controllers/manager/dashboardCRUD");
// import { getManagerDashboardDetails } from '../controllers/manager/dashboardC    RUD';
exports.manager = express_1.default.Router();
exports.manager.post('/signup', auth_middlewares_1.adminVerify, bodyValidation_1.managerSignupValidate, auth_1.signup);
exports.manager.post('/login', bodyValidation_1.validateLogin, auth_1.login);
exports.manager.get('/resortMangers:id', bodyValidation_1.paramsIdValidate, managerCRUD_1.getManagerDetailsByResortId);
exports.manager.get('/dashboardDetails', auth_middlewares_1.managerVerify, dashboardCRUD_1.getManagerDashboardDetails);
exports.manager.route('/:id?').get(auth_middlewares_1.adminVerify, managerCRUD_1.getAllManagerDetails).delete(auth_middlewares_1.adminVerify, bodyValidation_1.paramsIdValidate, managerCRUD_1.changeManagerStatus);
