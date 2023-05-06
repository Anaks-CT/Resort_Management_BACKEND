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
const user_model_1 = __importDefault(require("../models/user.model"));
const baseRepositary_1 = require("./baseRepositary");
const mongodb_1 = require("mongodb");
class UserRepository extends baseRepositary_1.BaseRepository {
    constructor() {
        super(user_model_1.default);
    }
    changePassword(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.default.updateOne({ email: email }, {
                $set: { password: password },
            });
        });
    }
    addToWishlist(userId, wishlistId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.default.updateOne({ _id: new mongodb_1.ObjectId(userId) }, {
                $addToSet: {
                    wishlist: wishlistId,
                },
            });
        });
    }
    deleteFromWishlist(userId, wishlistId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.default.updateOne({ _id: new mongodb_1.ObjectId(userId) }, {
                $pull: {
                    wishlist: wishlistId,
                },
            });
        });
    }
    addBookingId(userId, bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.default.updateOne({ _id: new mongodb_1.ObjectId(userId) }, {
                $addToSet: {
                    bookings: bookingId,
                },
            });
        });
    }
    removeBookingId(userId, bookingId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield user_model_1.default.updateOne({ _id: new mongodb_1.ObjectId(userId) }, {
                $pull: {
                    bookings: bookingId,
                },
            });
        });
    }
    updateUserDetails(userId, name, url) {
        return __awaiter(this, void 0, void 0, function* () {
            const update = { name: name };
            if (url) {
                update["image"] = url;
            }
            return yield user_model_1.default.findOneAndUpdate({ _id: userId }, { $set: update }, { new: true });
        });
    }
}
exports.default = UserRepository;
