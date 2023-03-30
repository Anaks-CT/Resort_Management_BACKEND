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
exports.adminLogin = void 0;
const errorResponse_1 = __importDefault(require("../../error/errorResponse"));
const adminLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        if (!email)
            throw errorResponse_1.default.forbidden('Admin must have an email to login');
        if (email !== process.env.email)
            throw errorResponse_1.default.unauthorized('Admin not found');
        if (password !== process.env.password)
            throw errorResponse_1.default.unauthorized('Invalid Password');
        res.send({ message: "Admin login successfull" });
    }
    catch (error) {
        return next(error);
    }
});
exports.adminLogin = adminLogin;
