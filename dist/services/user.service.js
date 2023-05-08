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
            const user = yield this.userRepositary.getById(id);
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
            const { modifiedCount } = yield this.userRepositary.changePassword(email, hashedPassword);
            if (modifiedCount === 0)
                throw errorResponse_1.default.internalError("Password not changed, Please try again");
        });
    }
    updateUserWishlist(userId, wishlistId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepositary.getById(userId);
            if (!user)
                throw errorResponse_1.default.notFound('User not found');
            const { modifiedCount } = yield this.userRepositary.addToWishlist(userId, wishlistId);
            if (modifiedCount !== 1)
                throw errorResponse_1.default.internalError('Dates not added to wishlist, Please try again later');
        });
    }
    deleteWishlistFromUser(userId, wishlistId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepositary.getById(userId);
            if (!user)
                throw errorResponse_1.default.notFound('User not found');
            const { modifiedCount } = yield this.userRepositary.deleteFromWishlist(userId, wishlistId);
            if (modifiedCount !== 1)
                throw errorResponse_1.default.internalError('Dates not discarded from wishlist');
        });
    }
    updateMemberDetails(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepositary.getById(userId);
            if (!user)
                throw errorResponse_1.default.notFound('User not found');
            if (user.totalmoneySpent > 100000) {
                yield this.userRepositary.updateMemberDetailsToDiamond(userId);
            }
            else if (user.totalmoneySpent > 30000) {
                yield this.userRepositary.updateMemberDetailsToPlatinum(userId);
            }
        });
    }
    updateUserPoints(userId, points) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepositary.getById(userId);
            if (!user)
                throw errorResponse_1.default.notFound('User not found');
            const { modifiedCount } = yield this.userRepositary.updateUserPoints(userId, points);
            if (modifiedCount === 0)
                throw errorResponse_1.default.internalError("Count not update user points");
        });
    }
    calculateUserPointsAndType(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepositary.getById(userId);
            if (!user)
                throw errorResponse_1.default.notFound('User not found');
            return { points: user.points, type: user.type };
        });
    }
    addBookingDetails(userId, bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepositary.getById(userId);
            if (!user)
                throw errorResponse_1.default.notFound('User not found');
            const { modifiedCount } = yield this.userRepositary.addBookingId(userId, bookingId);
            if (modifiedCount !== 1)
                throw errorResponse_1.default.internalError('Booking Id is not added to user Collection due to server error');
        });
    }
    updateMoneySpentandPoints(userId, taxCost, amount, userPoints) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepositary.getById(userId);
            if (!user)
                throw errorResponse_1.default.notFound('User not found');
            // decreasing the points used if any
            const { modifiedCount } = yield this.userRepositary.updatePointsAndMoneySpent(userId, Math.floor(taxCost / 3 - userPoints), amount);
            if (modifiedCount === 0)
                throw errorResponse_1.default.internalError('Cannot update your points, Please contact TRINITY helping desk');
        });
    }
    updateCancelBooking(userId, bookingAmountDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepositary.getById(userId);
            if (!user)
                throw errorResponse_1.default.notFound('User not found');
            const { pointsUsed, taxCost, totalCost } = bookingAmountDetails;
            // 2000 cancellation fee
            console.log(pointsUsed, taxCost, totalCost);
            const points = Math.floor(pointsUsed + (-taxCost / 3) + totalCost - 2000);
            console.log(points);
            const { modifiedCount } = yield this.userRepositary.incUserPoints(userId, points);
            if (modifiedCount === 0)
                throw errorResponse_1.default.internalError("Couldn't add amount to points, please contact the TRINITY helping desk");
        });
    }
    removeBookingDetails(userId, bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield this.userRepositary.getById(userId);
            if (!user)
                throw errorResponse_1.default.notFound('User not found');
            const { modifiedCount } = yield this.userRepositary.removeBookingId(userId, bookingId);
            if (modifiedCount !== 1)
                throw errorResponse_1.default.internalError('bookingId is not discarded from user"s data');
        });
    }
    updateUserDetails(userId, name, url) {
        return __awaiter(this, void 0, void 0, function* () {
            const checkUser = yield this.userRepositary.getById(userId);
            if (!checkUser)
                throw errorResponse_1.default.notFound('User not found');
            const newData = yield this.userRepositary.updateUserDetails(userId, name, url);
            if (!(newData === null || newData === void 0 ? void 0 : newData.isModified))
                throw errorResponse_1.default.internalError("Update failed due to internal Error, please try again later");
            return newData;
        });
    }
}
exports.default = UserService;
