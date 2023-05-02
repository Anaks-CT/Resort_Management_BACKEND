import express from "express";
import { login } from "../controllers/user/auth/login";
import {
    signup,
    verifyOTP,
    verifyPhone,
} from "../controllers/user/auth/signup";
import {
    emailQueryValidate,
    passwordValidate,
    validateLogin,
    validateSignup,
} from "../middlewares/bodyValidation";
import {
    changePassword,
    verifyEmail,
    // verifyForgotPasswordOTP,
} from "../controllers/user/auth/forgotPassword";

export const user = express.Router();

user.post("/signup", validateSignup, signup);
user.post("/login", validateLogin, login);
user.route("/verifyPhone").get(verifyPhone).post(verifyOTP);
user.route("/forgotPassword")
    .get(emailQueryValidate, verifyEmail)
    // .post(verifyForgotPasswordOTP)
    .put(emailQueryValidate, passwordValidate, changePassword);
