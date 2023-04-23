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
exports.manager = express_1.default.Router();
exports.manager.post('/signup', auth_middlewares_1.adminVerify, bodyValidation_1.managerSignupValidate, auth_1.signup);
exports.manager.post('/login', bodyValidation_1.validateLogin, auth_1.login);
exports.manager.route('/:id?').get(managerCRUD_1.getAllManagerDetails).delete(bodyValidation_1.paramsIdValidate, managerCRUD_1.changeManagerStatus);
