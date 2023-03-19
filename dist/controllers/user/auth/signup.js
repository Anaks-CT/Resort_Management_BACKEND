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
exports.signup = void 0;
const errorResponse_1 = __importDefault(require("../../../error/errorResponse"));
const auth_user_service_1 = __importDefault(require("../../../services/user.service/auth.user.service"));
const authService = new auth_user_service_1.default();
const signup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const { name, phone, email, password } = req.body;
    try {
        const { user } = yield authService.signup(name, phone, email, password);
        res.send({ message: "new user created", data: user });
    }
    catch (error) {
        if (error.code === 11000)
            return next(errorResponse_1.default.badRequest("User already registered"));
        return next(error);
    }
});
exports.signup = signup;
