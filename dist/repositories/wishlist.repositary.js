"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const baseRepositary_1 = require("./baseRepositary");
const wishlist_model_1 = __importDefault(require("../models/wishlist.model"));
class WishlistRepositary extends baseRepositary_1.BaseRepository {
    constructor() {
        super(wishlist_model_1.default);
    }
}
exports.default = WishlistRepositary;
