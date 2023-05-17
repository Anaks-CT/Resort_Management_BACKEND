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
exports.deleteWishlist = exports.getWishlistByUserId = exports.addToWishlist = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const wishllist_service_1 = __importDefault(require("../../services/wishllist.service"));
const user_service_1 = __importDefault(require("../../services/user.service"));
const wishlistService = new wishllist_service_1.default();
const userService = new user_service_1.default();
exports.addToWishlist = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.user;
    const { wishlistDetails } = req.body;
    const wishlist = yield wishlistService.createWishlist(_id, wishlistDetails);
    yield userService.updateUserWishlist(_id, wishlist._id);
    res.status(200).json({ message: "Dates added to your wishlist" });
}));
exports.getWishlistByUserId = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.user;
    const wishlists = yield wishlistService.getAllUserWishlist(_id);
    res.status(200).json({ message: "Fetching wishlists successfull", data: wishlists });
}));
exports.deleteWishlist = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.user;
    const { id } = req.params;
    yield wishlistService.deleteWishlist(id);
    yield userService.deleteWishlistFromUser(_id, id);
    const allWishlist = yield wishlistService.getAllUserWishlist(_id);
    res.status(200).json({ message: "Dates removed from your wishlist", data: allWishlist });
}));
