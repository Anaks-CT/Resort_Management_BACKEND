import mongoose, { model, Schema } from "mongoose";
import { IRoom } from "../interface/room.interface";

const roomSchema = new Schema<IRoom>(
    {
        name: { type: String, required: true },
        description: { type: String, required: true },
        area: { type: Number, required: true },
        resortId: { type: mongoose.Types.ObjectId, ref: "Resort" },
        images: [{ type: String, required: true }],
        packages: [
            {
                packageName: { type: String, required: true },
                cost: { type: Number, required: true },
                features: [String],
            },
        ],
        maxPeople: { type: Number, required: true },
        roomNumbers: [{ number: String, unavailableDates: { type: [Date] }}],
        highlights: [String],
        amenities: [String],
        facilities: [String],
        active: {type: Boolean, default: true}
    },
    { timestamps: true }
);

export default model<IRoom>("Room", roomSchema);
