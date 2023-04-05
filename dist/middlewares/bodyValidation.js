"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.resortValidate = exports.validateLogin = exports.validateSignup = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const errorResponse_1 = __importDefault(require("../error/errorResponse"));
const yupSchema_1 = require("./yupSchema");
// Validating req.body before reaching controller
// signup body validation
exports.validateSignup = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body = yield yupSchema_1.signupSchema.validate(req.body);
        next();
    }
    catch (err) {
        throw errorResponse_1.default.unauthorized(err.errors[0]);
    }
}));
// login body validation
exports.validateLogin = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body = yield yupSchema_1.loginSchema.validate(req.body);
        next();
    }
    catch (err) {
        throw errorResponse_1.default.unauthorized(err.errors[0]);
    }
}));
// add resort body validation
exports.resortValidate = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body = yield yupSchema_1.addResort.validate(req.body);
        next();
    }
    catch (err) {
        throw errorResponse_1.default.unauthorized(err.errors[0]);
    }
}));
