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

export const verifyPhone = asyncHandler( async (req, res) => {
    await authService.verifyPhone(req.query.phone as string, req.query.email as string)
    res.status(200).json({message: "Phone verification successful"})
})

export const verifyOTP = asyncHandler( async (req, res) => {
    const {otp, phone} = req.query
    await authService.verifyOTP(otp as string, phone as string)
    res.status(200).json({message: "OTP verification successful"})
})