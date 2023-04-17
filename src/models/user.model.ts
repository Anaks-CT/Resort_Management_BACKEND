import { model, Schema } from "mongoose";
import { IUser } from "../interface/user.interface";

const userSchema = new Schema<IUser>({
  name: { type: String, required: true },
  phone: { type: Number, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  address: {
    addressLine1: { type: String},
    addressLine2: { type: String},
    addressLine3: { type: String},
    city: { type: String},
    pincode: { type: Number},
    country: { type: String},
  },
  role: {type: String, default: "user"}
},{ timestamps: true });

export default model<IUser>("User", userSchema);
