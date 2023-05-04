import { BaseRepository } from "./baseRepositary";
import { ObjectId } from "mongodb";
import wishlistModel from "../models/wishlist.model";
import { IWishlist } from "../interface/wishlist.interface";

class WishlistRepositary extends BaseRepository {
    constructor() {
        super(wishlistModel);
    }

    // async createWishlist(wishlistDetails: IWishlist) {
    //     return await wishlistModel.
    // }
    
}
export default WishlistRepositary;
