import asyncHandler from "express-async-handler";
import AuthService from "../../services/auth.service";
import ErrorResponse from "../../error/errorResponse";
import { IManager } from "../../interface/manager.interface";
import ManagerService from "../../services/manager.service";
// import AuthService from "../../../services/user.service/auth.user.service";

const authService = new AuthService();
const managerService = new ManagerService
export const login = asyncHandler( async (req, res) => {
  const { email, password } = req.body;
    const { user } = await authService.login("manager",email, password);
    res.json({ message: "Login successfull", data: user });
})


export const signup = asyncHandler(async (req, res, next) => {
    const { name, phone, email, password, resortId } = req.body;
    const signupDetails = {name, phone, email, password, resortId}
    try {
        const user = await managerService.createManager(signupDetails);
        res.json({ message: "Register Successfull !!", data: user });
    } catch (error: any) {
        if (error.code === 11000)
            return next(ErrorResponse.badRequest("User already registered"));
        return next(error);
    }
});
