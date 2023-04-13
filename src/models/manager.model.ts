import mongoose, { model, Schema } from "mongoose";
import { IUser } from "../interface/user.interface";

const managerSchema = new Schema({
    name: { type: String, required: true},
    phone: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profileImage: { type: String },
    resortId: { type: mongoose.Types.ObjectId, ref: "Resort", required: true},
    active: {type: Boolean, default: true}
});
export default model("Manager", managerSchema);
