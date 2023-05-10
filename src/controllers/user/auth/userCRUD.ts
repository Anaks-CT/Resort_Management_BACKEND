import asyncHandler from "express-async-handler"
import UserService from "../../../services/user.service";
import { RequestWithUser } from "../../../middlewares/auth-middlewares";

const userService = new UserService();


export const getUserDetail = asyncHandler( async (req: RequestWithUser, res) => {
    const {_id} = req.user
    const {_doc: {password, role, ...userDetails}} = await userService.getSingleUserDetails(_id)
    res.status(200).json({message: "User details fetched successfully", data: userDetails})
})

export const updateUserDetails = asyncHandler( async (req: RequestWithUser, res) => {
    const {_id} = req.user
    const {image, name} = req.body.updateDetails
    const updatedUserDetails = await userService.updateUserDetails(_id, name, image,)
    res.status(200).json({message: "User details updated successfully", data: updatedUserDetails})
})

export const getAllUserDetails = asyncHandler( async (req: RequestWithUser, res) => {
    const allUsers = await userService.getAllUserDetails()
    res.status(200).json({message: "User details fetched successfully", data: allUsers})
})

export const searchSortedUserDetails = asyncHandler( async( req, res) => {
    const {searchInput, sortBy, sortOrder} = req.query 
    const allUsers = await userService.getSerchSortedUserDetails(searchInput as string, sortOrder as string, sortBy as string)
    res.status(200).json({message: "User details fetched successfully", data: allUsers})
})

export const updateUserStatus = asyncHandler(async(req: RequestWithUser, res) => {
    const {_id} = req.user
    const {id: userId} = req.params
    await userService.updateUserStatus(userId, _id!=process.env.password && _id)
    const allUsers = await userService.getAllUserDetails()
    res.status(200).json({message: "User status updated successfully", data: allUsers})
})