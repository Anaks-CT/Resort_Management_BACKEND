import asyncHandler from "express-async-handler"
import UserService from "../../../services/user.service";
import { RequestWithUser } from "../../../middlewares/auth-middlewares";

const userService = new UserService();


export const getUserDetail = asyncHandler( async (req: RequestWithUser, res) => {
    const {_id} = req.user
    const user = await userService.getSingleUserDetails(_id)
    const {password, role, ...userDetails} = user._doc
    res.status(200).json({message: "User details fetched successfully", data: userDetails})
})

export const updateUserDetails = asyncHandler( async (req: RequestWithUser, res) => {
    const {_id} = req.user
    const {image, name} = req.body.updateDetails
    const updatedUserDetails = await userService.updateUserDetails(_id, name, image,)
    res.status(200).json({message: "User details updates successfully", data: updatedUserDetails})
})