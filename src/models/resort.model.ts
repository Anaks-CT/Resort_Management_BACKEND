import mongoose, { model, Schema, Document } from "mongoose";
import { IResort } from "../interface/resort.interface";

const resortSchema = new Schema<IResort>({
  resortDetails: {
    name: { type: String, required: true, unique: true},
    heading: { type: String, required: true },
    description: { type: String, required: true },
    image: {type: String, required: true},
    features: [String],
  },
  rooms: {type: [mongoose.Types.ObjectId], ref: "Room"},//changed from string to mongoose types objectID
  manager: { type: mongoose.Types.ObjectId, ref: "Manager" },
  location: { type: String, required: true },
  email: { type: String, required: true }, 
  customerCareNo: { type: Number, required: true },
  gallaryId:{type: mongoose.Types.ObjectId , ref:'Gallary'}, 
  active:{type: Boolean , default: true}
});

export default model<IResort & Document>("Resort", resortSchema);
