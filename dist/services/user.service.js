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
const errorResponse_1 = __importDefault(require("../error/errorResponse"));
const user_repository_1 = __importDefault(require("../repositories/user.repository"));
const twilio_1 = require("../utils/twilio");
const bcrypt_1 = __importDefault(require("bcrypt"));
class UserService {
    constructor(userRepositary = new user_repository_1.default()) {
        this.userRepositary = userRepositary;
    }
    getSingleUserDetails(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepositary.getOne({ _id: id });
            if (!user)
                throw errorResponse_1.default.notFound('User not found');
            return user;
        });
    }
    forgotPasswordverifyEmail(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepositary.getByEmail(email);
            if (!user)
                throw errorResponse_1.default.notFound('User not found');
            const sendOTP = yield (0, twilio_1.sendVerificationToken)(user.phone.toString());
            if (!sendOTP)
                throw errorResponse_1.default.internalError('Some error occured, please try again');
            return user.phone;
        });
    }
    changePassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepositary.getByEmail(email);
            if (!user)
                throw errorResponse_1.default.notFound('User not found');
            const hashedPassword = yield bcrypt_1.default.hash(password, 10);
            const updateResult = yield this.userRepositary.changePassword(email, hashedPassword);
            if (updateResult.modifiedCount === 0)
                throw errorResponse_1.default.internalError("Password not changed, Please try again");
        });
    }
    updateUserWishlist(userId, wishlistId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepositary.getById(userId);
            if (!user)
                throw errorResponse_1.default.notFound('User not found');
            const updateResult = yield this.userRepositary.addToWishlist(userId, wishlistId);
            if (updateResult.modifiedCount !== 1)
                throw errorResponse_1.default.internalError('Dates not added to wishlist, Please try again later');
        });
    }
    deleteWishlistFromUser(userId, wishlistId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepositary.getById(userId);
            if (!user)
                throw errorResponse_1.default.notFound('User not found');
            const updateResult = yield this.userRepositary.deleteFromWishlist(userId, wishlistId);
            if (updateResult.modifiedCount !== 1)
                throw errorResponse_1.default.internalError('Dates not discarded from wishlist');
        });
    }
}
exports.default = UserService;
