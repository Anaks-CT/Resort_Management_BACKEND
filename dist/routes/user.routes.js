"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.user = void 0;
const express_1 = __importDefault(require("express"));
const login_1 = require("../controllers/user/auth/login");
const signup_1 = require("../controllers/user/auth/signup");
const bodyValidation_1 = require("../middlewares/bodyValidation");
const forgotPassword_1 = require("../controllers/user/auth/forgotPassword");
const wishlistCRUD_1 = require("../controllers/wishlist/wishlistCRUD");
const auth_middlewares_1 = require("../middlewares/auth-middlewares");
exports.user = express_1.default.Router();
exports.user.post("/signup", bodyValidation_1.validateSignup, signup_1.signup);
exports.user.post("/login", bodyValidation_1.validateLogin, login_1.login);
exports.user.route("/verifyPhone").get(signup_1.verifyPhone).post(signup_1.verifyOTP);
exports.user.route("/forgotPassword")
    .get(bodyValidation_1.emailQueryValidate, forgotPassword_1.verifyEmail)
    .put(bodyValidation_1.emailQueryValidate, bodyValidation_1.passwordValidate, forgotPassword_1.changePassword);
exports.user.route("/wishlist:id?")
    .get(auth_middlewares_1.userVerify, wishlistCRUD_1.getWishlistByUserId)
    .post(auth_middlewares_1.userVerify, bodyValidation_1.wishlistDetails, wishlistCRUD_1.addToWishlist)
    .delete(bodyValidation_1.paramsIdValidate);
