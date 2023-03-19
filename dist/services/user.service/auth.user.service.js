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
const bcrypt_1 = __importDefault(require("bcrypt"));
const errorResponse_1 = __importDefault(require("../../error/errorResponse"));
const user_repository_1 = __importDefault(require("../../repositories/user.repository"));
class AuthService {
    constructor(userRepository = new user_repository_1.default()) {
        this.userRepository = userRepository;
    }
    signup(name, phone, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const checkUserDupe = yield this.userRepository.finduser(email);
            if (checkUserDupe)
                throw errorResponse_1.default.unauthorized('Email aldready Registered');
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const user = yield this.userRepository.createUser(name, phone, email, hashedPassword);
            return { user };
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepository.finduser(email);
            if (!user) {
                throw errorResponse_1.default.unauthorized('User not found');
            }
            const isPasswordMatch = yield bcrypt_1.default.compare(password, user.password);
            if (!isPasswordMatch) {
                throw errorResponse_1.default.unauthorized('Invalid Email or Password');
            }
            return { user };
        });
    }
}
// const token = jwt.sign({ id: user._id }, config.jwtSecret);
exports.default = AuthService;
