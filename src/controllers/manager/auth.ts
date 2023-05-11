import asyncHandler from "express-async-handler";
import AuthService from "../../services/auth.service";
import ErrorResponse from "../../error/errorResponse";
import { IManager } from "../../interface/manager.interface";
import ManagerService from "../../services/manager.service";
import ResortService from "../../services/resort.service";
// import AuthService from "../../../services/user.service/auth.user.service";

const authService = new AuthService();
const managerService = new ManagerService();
const resortService = new ResortService();

export const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const {
        user: {
            _doc: { password: hashedPassword, ...managerDetails },
        },
        token,
    } = await authService.login("manager", email, password);
    const {
        _id,
        resortDetails: { name },
    } = await resortService.getResortById(managerDetails.resortId);
    res.json({
        message: "Login successfull",
        data: managerDetails,
        token,
        resortDetails: { resortId:_id, resortName: name },
    });
});

export const signup = asyncHandler(async (req, res, next) => {
    const { name, phone, email, password, resortId } = req.body;
    const signupDetails = { name, phone, email, password, resortId };
    try {
        await managerService.createManager(signupDetails);
        const updatedManagerDetails =
            await managerService.getAllManagerDetails();
        res.json({ message: "New Manager Added", data: updatedManagerDetails });
    } catch (error: any) {
        if (error.code === 11000)
            return next(ErrorResponse.badRequest("User already registered"));
        return next(error);
    }
});
