import express from "express";
import { login } from "../controllers/user/auth/login";
import {
    signup,
    verifyOTP,
    verifyPhone,
} from "../controllers/user/auth/signup";
import {
    emailQueryValidate,
    paramsIdValidate,
    passwordValidate,
    validateLogin,
    validateSignup,
    wishlistDetails,
} from "../middlewares/bodyValidation";
import {
    changePassword,
    verifyEmail,
    // verifyForgotPasswordOTP,
} from "../controllers/user/auth/forgotPassword";
import {
    addToWishlist,
    deleteWishlist,
    getWishlistByUserId,
} from "../controllers/wishlist/wishlistCRUD";
import { userVerify } from "../middlewares/auth-middlewares";

export const user = express.Router();

user.post("/signup", validateSignup, signup);
user.post("/login", validateLogin, login);
user.route("/verifyPhone").get(verifyPhone).post(verifyOTP);
user.route("/forgotPassword")
    .get(emailQueryValidate, verifyEmail)
    .put(emailQueryValidate, passwordValidate, changePassword);

user.route("/wishlist/:id?")
    .get(userVerify, getWishlistByUserId)
    .post(userVerify, wishlistDetails, addToWishlist)
    .delete(userVerify, paramsIdValidate, deleteWishlist)
