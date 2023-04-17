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
exports.signup = exports.login = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const auth_service_1 = __importDefault(require("../../services/auth.service"));
const errorResponse_1 = __importDefault(require("../../error/errorResponse"));
const manager_service_1 = __importDefault(require("../../services/manager.service"));
// import AuthService from "../../../services/user.service/auth.user.service";
const authService = new auth_service_1.default();
const managerService = new manager_service_1.default;
exports.login = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { email, password } = req.body;
    const { user } = yield authService.login("manager", email, password);
    res.json({ message: "Login successfull", data: user });
}));
exports.signup = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, phone, email, password, resortId } = req.body;
    const signupDetails = { name, phone, email, password, resortId };
    try {
        yield managerService.createManager(signupDetails);
        const updatedManagerDetails = yield managerService.getAllManagerDetails();
        res.json({ message: "New Manager Added", data: updatedManagerDetails });
    }
    catch (error) {
        if (error.code === 11000)
            return next(errorResponse_1.default.badRequest("User already registered"));
        return next(error);
    }
}));
