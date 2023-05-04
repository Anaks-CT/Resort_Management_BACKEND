import ErrorResponse from "../error/errorResponse";
import { IUser } from "../interface/user.interface";
import userModel from "../models/user.model";
import { BaseRepository } from "./baseRepositary";
import { ObjectId } from "mongodb";

class UserRepository extends BaseRepository {
    constructor() {
        super(userModel);
    }

    async changePassword(email: string, password: string) {
        return await userModel.updateOne(
            { email: email },
            {
                $set: { password: password },
            }
        );
    }

    async addToWishlist(userId: string, wishlistId: string) {
        return await userModel.updateOne(
            { _id: new ObjectId(userId) },
            {
                $addToSet: {
                    wishlist: wishlistId,
                },
            }
        );
    }

    async deleteFromWishlist(userId: string, wishlistId: string) {
        return await userModel.updateOne(
            { _id: new ObjectId(userId) },
            {
                $pull: {
                    wishlist: wishlistId,
                },
            }
        );
    }
}

export default UserRepository;
