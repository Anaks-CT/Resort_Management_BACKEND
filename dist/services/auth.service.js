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
exports.AuthService = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const errorResponse_1 = __importDefault(require("../error/errorResponse"));
const user_repository_1 = __importDefault(require("../repositories/user.repository"));
const manager_repositary_1 = __importDefault(require("../repositories/manager.repositary"));
const jwtTokenManage_1 = require("../utils/jwtTokenManage");
const twilio_1 = require("../utils/twilio");
class AuthService {
    constructor(userRepository = new user_repository_1.default(), managerRepositary = new manager_repositary_1.default()) {
        this.userRepository = userRepository;
        this.managerRepositary = managerRepositary;
    }
    login(role, email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            let repositary;
            if (role === "user") {
                repositary = this.userRepository;
            }
            else if (role === "manager") {
                repositary = this.managerRepositary;
            }
            else {
                repositary = null;
            }
            if (!repositary)
                throw errorResponse_1.default.badRequest('Please provide role');
            const user = yield repositary.getByEmail(email);
            if (!user)
                throw errorResponse_1.default.unauthorized("User not found");
            if (user.status === false || user.active === false)
                throw errorResponse_1.default.forbidden('Your access have been revoked');
            const isPasswordMatch = yield bcrypt_1.default.compare(password, user.password);
            if (!isPasswordMatch) {
                throw errorResponse_1.default.unauthorized("Invalid Email or Password");
            }
            // const {password: _, ...detail} = user
            return { user, token: (0, jwtTokenManage_1.signToken)(user._id) };
        });
    }
    verifyPhone(phoneNumber, email) {
        return __awaiter(this, void 0, void 0, function* () {
            const emailDupe = yield this.userRepository.getOne({ email: email });
            if (emailDupe)
                throw errorResponse_1.default.conflict("Email already registered");
            const checkDupePhone = yield this.userRepository.getAll({ phone: phoneNumber });
            if (checkDupePhone.length >= 5)
                throw errorResponse_1.default.conflict("Can't create more than 5 account with single mobile number");
            const sendOTP = yield (0, twilio_1.sendVerificationToken)(phoneNumber);
            if (!sendOTP)
                throw errorResponse_1.default.internalError('Some error occured, please try again');
            return true;
        });
    }
    verifyOTP(OTP, phoneNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            const verifyOTp = yield (0, twilio_1.checkVerificationToken)(OTP, phoneNumber);
            if (!verifyOTp)
                throw errorResponse_1.default.badRequest('Incorrect OTP');
            return true;
        });
    }
    signup(role, signupDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            let repositary;
            if (role === "user") {
                repositary = this.userRepository;
            }
            else if (role === "manager") {
                repositary = this.managerRepositary;
            }
            else {
                repositary = null;
            }
            // if(role === "manager"){
            //     if()
            // }
            if (!repositary)
                throw errorResponse_1.default.badRequest('Please provide role');
            const checkUserDupe = yield repositary.getByEmail(signupDetails.email);
            if (checkUserDupe)
                throw errorResponse_1.default.conflict('Email aldready Registered');
            const hashedPassword = yield bcrypt_1.default.hash(signupDetails.password, 10);
            const userDetails = Object.assign(Object.assign({}, signupDetails), { password: hashedPassword });
            const user = yield repositary.create(userDetails);
            if (!user)
                throw errorResponse_1.default.internalError(`${role} not Registered`);
            return user;
        });
    }
}
exports.AuthService = AuthService;
// const token = jwt.sign({ id: user._id }, config.jwtSecret);
exports.default = AuthService;
