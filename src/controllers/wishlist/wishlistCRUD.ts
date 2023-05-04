
import RoomService from "../../services/room.service";
import asyncHandler from "express-async-handler";
import WishlistService from "../../services/wishllist.service";
import UserService from "../../services/user.service";
import { RequestWithUser } from "../../middlewares/auth-middlewares";

const wishlistService = new WishlistService();
const userService = new UserService()

export const addToWishlist = asyncHandler(async (req: RequestWithUser, res) => {
    const {_id} = req.user
    console.log(_id);
    const {wishlistDetails} = req.body
    const wishlist = await wishlistService.createWishlist(_id, wishlistDetails)
    await userService.updateUserWishlist(_id, wishlist._id!)
    res.status(200).json({message: "Dates added to your wishlist"})
});

export const getWishlistByUserId = asyncHandler(async (req: RequestWithUser, res) => {
    const {_id} = req.user
    const wishlists = await wishlistService.getAllUserWishlist(_id)
    res.status(200).json({message: "Fetching wishlists successfull", data: wishlists})
})

export const deleteWishlist = asyncHandler(async (req: RequestWithUser, res) => {
    const {_id} = req.user
    const {id} = req.params
    await wishlistService.deleteWishlist(id)
    await userService.deleteWishlistFromUser(_id, id)
    res.status(200).json({message: "Dates removed from your wishlist"})
})
