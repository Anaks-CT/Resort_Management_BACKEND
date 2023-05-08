import mongoose, { model, Schema } from "mongoose";
import { IUser } from "../interface/user.interface";

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  phone: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  image:{type: String},
  type: {type: String, default: "member"},
  totalmoneySpent: {type: Number, default: 0},
  bookings: [mongoose.Types.ObjectId],
  points: {type: Number, default: 100},
  wishlist: [mongoose.Types.ObjectId],
  role: {type: String, default: "user"}
},{ timestamps: true });

export default model<IUser>("User", userSchema);
