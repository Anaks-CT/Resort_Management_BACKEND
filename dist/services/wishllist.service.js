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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const errorResponse_1 = __importDefault(require("../error/errorResponse"));
const user_repository_1 = __importDefault(require("../repositories/user.repository"));
const wishlist_repositary_1 = __importDefault(require("../repositories/wishlist.repositary"));
const mongodb_1 = require("mongodb");
class WishlistService {
    constructor(wishlistRepositary = new wishlist_repositary_1.default(), userRepositary = new user_repository_1.default()) {
        this.wishlistRepositary = wishlistRepositary;
        this.userRepositary = userRepositary;
    }
    createWishlist(userId, wishlistDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            const checkUser = yield this.userRepositary.getById(userId);
            if (!checkUser)
                throw errorResponse_1.default.notFound("User not found");
            const { dates, noOfGuests, noOfRooms, resortId } = wishlistDetails;
            const wishlist = {
                userId: new mongodb_1.ObjectId(userId),
                resortId: new mongodb_1.ObjectId(resortId),
                noOfRooms: noOfRooms,
                noOfGuests: noOfGuests,
                dates: dates,
            };
            return yield this.wishlistRepositary.create(wishlist);
        });
    }
    getAllUserWishlist(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const wishlistDetails = yield this.wishlistRepositary.getAll({ userId: userId });
            if (!wishlistDetails)
                throw errorResponse_1.default.notFound("You don't have any saved dates !!");
            const populatedWishlist = yield this.wishlistRepositary.populate(wishlistDetails, "resortId");
            const data = populatedWishlist.map((wishlist) => {
                const _a = wishlist._doc, { resortId, userId } = _a, rest = __rest(_a, ["resortId", "userId"]);
                return Object.assign({ resortName: resortId.resortDetails.name }, rest);
            });
            return data;
        });
    }
    deleteWishlist(wishlistId) {
        return __awaiter(this, void 0, void 0, function* () {
            const checkWishlist = yield this.wishlistRepositary.getById(wishlistId);
            if (!checkWishlist)
                throw errorResponse_1.default.notFound('Cannot find Selected wishlist');
            yield this.wishlistRepositary.deleteById(wishlistId);
        });
    }
}
exports.default = WishlistService;
