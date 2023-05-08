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

    async addBookingId(userId: string, bookingId: string) {
        return await userModel.updateOne(
            { _id: new ObjectId(userId) },
            {
                $addToSet: {
                    bookings: bookingId,
                },
            }
        );
    }

    async removeBookingId(userId: string, bookingId: string) {
        return await userModel.updateOne(
            { _id: new ObjectId(userId) },
            {
                $pull: {
                    bookings: bookingId,
                },
            }
        );
    }

    async updateMemberDetailsToPlatinum(userId: string){
        return await userModel.updateOne({_id: userId}, {
            $set: {
                type: "platinum"
            }
        })
    }

    async updateMemberDetailsToDiamond(userId: string){
        return await userModel.updateOne({_id: userId}, {
            $set: {
                type: "diamond"
            }
        })
    }

    async updateUserPoints(userId: string, points: number){
        return await userModel.updateOne({_id: userId},{
            $set : {
                points: points
            }
        })
    }

    async incUserPoints(userId: string, points: number) {
        return await userModel.updateOne(
            { _id: new ObjectId(userId) },
            {
                $inc: {
                    points: +points,
                },
            }
        );
    }

    async updateUserDetails(userId: string, name: string, url?: string) {
        const update: { name: string; image?: string } = { name: name };
        if (url) {
            update["image"] = url;
        }
        return await userModel.findOneAndUpdate(
            { _id: userId },
            { $set: update },
            { new: true }
        );
    }

    async updatePointsAndMoneySpent(userId: string, points: number, amount: number) {
        return await userModel.updateOne(
            { _id: userId },
            {
                $inc: {
                    points: points,
                    totalmoneySpent: amount
                },
            }
        );
    }
}

export default UserRepository;
