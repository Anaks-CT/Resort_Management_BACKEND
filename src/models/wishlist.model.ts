import mongoose, { model, Schema } from "mongoose";
import { IWishlist } from "../interface/wishlist.interface";

const wishlistSchema = new Schema<IWishlist>({
    userId: { type: mongoose.Types.ObjectId, required: true },
    resortId: { type: mongoose.Types.ObjectId, required: true, ref: "Resort" },
    roomDetail: [Number],
    dates: {
        startDate: { type: Date, required: true },
        endDate: { type: Date, required: true },
    },
});

export default model<IWishlist>("Wishlist", wishlistSchema);
