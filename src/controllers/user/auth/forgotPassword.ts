import expressAsyncHandler from "express-async-handler";
import UserService from "../../../services/user.service";
import AuthService from "../../../services/auth.service";

const userService = new UserService();
const authService = new AuthService();

export const verifyEmail = expressAsyncHandler(async (req, res) => {
    console.log('object');
    const phone = await userService.forgotPasswordverifyEmail(req.query.email as string)
    res.status(200).json({message: "User Details fetched successfully", data: phone})
});

// export const verifyForgotPasswordOTP = expressAsyncHandler( async (req, res) => {
//     const {otp, phone} = req.query
//     await authService.verifyOTP(otp as string, phone as string)
//     res.status(200).json({message: "OTP verification successful"})
// })

export const changePassword = expressAsyncHandler( async (req, res) => {
    const {password} = req.body.passwordDetails
    const {email} = req.query
    await userService.changePassword(email as string, password)
    res.status(200).json({message: "Password changed successfully"})
})