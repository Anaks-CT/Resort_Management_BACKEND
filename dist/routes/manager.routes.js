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
exports.manager = express_1.default.Router();
exports.manager.get('/', managerCRUD_1.getAllManagerDetails);
exports.manager.post('/signup', bodyValidation_1.validateSignup, auth_1.signup);
exports.manager.post('/login', bodyValidation_1.validateLogin, auth_1.login);
