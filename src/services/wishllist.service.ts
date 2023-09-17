import ErrorResponse from "../error/errorResponse";
import { IBookingForm1 } from "../interface/booking.interface";
import { IResort } from "../interface/resort.interface";
import { IUser } from "../interface/user.interface";
import { IWishlist } from "../interface/wishlist.interface";
import UserRepository from "../repositories/user.repository";
import WishlistRepositary from "../repositories/wishlist.repositary";
import { ObjectId } from "mongodb";

export default class WishlistService {
    constructor(
        private wishlistRepositary = new WishlistRepositary(),
        private userRepositary = new UserRepository()
    ) {}

    async createWishlist(userId: string, wishlistDetails: IBookingForm1) {
        const checkUser = await this.userRepositary.getById<IUser>(userId);
        if (!checkUser) throw ErrorResponse.notFound("User not found");
        const { destination, roomDetail, date } = wishlistDetails;
        const wishlist: IWishlist = {
            userId: new ObjectId(userId),
            resortId: new ObjectId(destination.id),
            roomDetail: roomDetail,
            dates: date,
        };
        return await this.wishlistRepositary.create<IWishlist>(wishlist);
    }

    async getAllUserWishlist(userId: string) {
        const wishlistDetails = await this.wishlistRepositary.getAll<IWishlist>(
            { userId: userId }
        );
        if (!wishlistDetails)
            throw ErrorResponse.notFound("You don't have any saved dates !!");
        const populatedWishlist = await this.wishlistRepositary.populate(
            wishlistDetails,
            "resortId"
        );
        const data: IWishlist[] = populatedWishlist.map((wishlist: any) => {
            const { resortId, userId, ...rest } = wishlist._doc;
            return {
                resortName: resortId.resortDetails.name,
                resortId: resortId._id,
                ...rest,
            };
        });
        return data;
    }

    async deleteWishlist(wishlistId: string) {
        const checkWishlist = await this.wishlistRepositary.getById<IWishlist>(
            wishlistId
        );
        if (!checkWishlist)
            throw ErrorResponse.notFound("Cannot find Selected wishlist");
        await this.wishlistRepositary.deleteById<IWishlist>(wishlistId);
    }

    async checkWishlistDate(wishlist: IWishlist[]) {
        const currentDate = new Date();
        const deletePromises: Promise<void>[] = [];
        wishlist.forEach((item) => {
            const startDate = new Date(item.dates.startDate);
            if (startDate < currentDate) {
                // Create a promise to delete the item and add it to the array of delete promises.
                deletePromises.push(this.deleteWishlist(item._id!));
            }
        });

        // Use Promise.all to concurrently delete the items.
        await Promise.all(deletePromises);
    }
}
