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
exports.verifyOTP = exports.verifyPhone = exports.signup = void 0;
const errorResponse_1 = __importDefault(require("../../../error/errorResponse"));
const auth_service_1 = __importDefault(require("../../../services/auth.service"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const authService = new auth_service_1.default();
exports.signup = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, phone, email, password } = req.body;
    const signupDetail = { name, phone, email, password };
    try {
        const user = yield authService.signup('user', signupDetail);
        res.status(201).json({ message: "Register Successfull !!", data: user });
    }
    catch (error) {
        if (error.code === 11000)
            return next(errorResponse_1.default.badRequest("User already registered"));
        return next(error);
    }
}));
exports.verifyPhone = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield authService.verifyPhone(req.query.phone, req.query.email);
    res.status(200).json({ message: "Phone verification successful" });
}));
exports.verifyOTP = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { otp, phone } = req.query;
    yield authService.verifyOTP(otp, phone);
    res.status(200).json({ message: "OTP verification successful" });
}));
