"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = void 0;
const express_1 = __importDefault(require("express"));
const login_1 = require("../controllers/user/auth/login");
const signup_1 = require("../controllers/user/auth/signup");
exports.user = express_1.default.Router();
exports.user.post('/signup', signup_1.signup);
exports.user.post('/login', login_1.login);
