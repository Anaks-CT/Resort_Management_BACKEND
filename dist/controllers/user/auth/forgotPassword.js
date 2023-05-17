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
exports.changePassword = exports.verifyEmail = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const user_service_1 = __importDefault(require("../../../services/user.service"));
const auth_service_1 = __importDefault(require("../../../services/auth.service"));
const userService = new user_service_1.default();
const authService = new auth_service_1.default();
exports.verifyEmail = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const phone = yield userService.forgotPasswordverifyEmail(req.query.email);
    res.status(200).json({ message: "User Details fetched successfully", data: phone });
}));
// export const verifyForgotPasswordOTP = expressAsyncHandler( async (req, res) => {
//     const {otp, phone} = req.query
//     await authService.verifyOTP(otp as string, phone as string)
//     res.status(200).json({message: "OTP verification successful"})
// })
exports.changePassword = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { password } = req.body.passwordDetails;
    const { email } = req.query;
    yield userService.changePassword(email, password);
    res.status(200).json({ message: "Password changed successfully" });
}));
