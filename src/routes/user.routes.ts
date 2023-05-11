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
    updateUserDetailValidate,
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
import { adminOrMangerVerify, adminVerify, authMiddleware, userVerify } from "../middlewares/auth-middlewares";
import {
    getAllUserDetails,
    getUserDetail,
    searchSortedUserDetails,
    updateUserDetails,
    updateUserStatus,
} from "../controllers/user/auth/userCRUD";

export const user = express.Router();

user.post("/signup", validateSignup, signup);
user.post("/login", validateLogin, login);
user.route("/verifyPhone").get(verifyPhone).post(verifyOTP);
user.route("/forgotPassword")
    .get(emailQueryValidate, verifyEmail)
    .put(emailQueryValidate, passwordValidate, changePassword);

user.get("/fetchAll",adminOrMangerVerify, getAllUserDetails)
user.get('/service', adminOrMangerVerify, searchSortedUserDetails)

user.route("/wishlist/:id?")
    .get(userVerify, getWishlistByUserId)
    .post(userVerify, wishlistDetails, addToWishlist)
    .delete(userVerify, paramsIdValidate, deleteWishlist);

user.route("/:id?")
    .get(userVerify, getUserDetail)
    .patch(userVerify, updateUserDetailValidate, updateUserDetails)
    .delete(adminOrMangerVerify, paramsIdValidate, updateUserStatus)

