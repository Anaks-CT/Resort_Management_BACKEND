import ErrorResponse from "../../../error/errorResponse";
import AuthService from "../../../services/auth.service";
import asyncHandler from "express-async-handler";

const authService = new AuthService();

export const signup = asyncHandler(async (req, res, next) => {
    const { name, phone, email, password } = req.body;
    const signupDetail = {name, phone, email, password}
    try {
        const user = await authService.signup('user',signupDetail);
        res.status(201).json({ message: "Register Successfull !!", data: user });
    } catch (error: any) {
        if (error.code === 11000)
            return next(ErrorResponse.badRequest("User already registered"));
        return next(error);
    }
})
