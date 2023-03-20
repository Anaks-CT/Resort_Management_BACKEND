import mongoose, { model, Schema } from "mongoose";
import { IResort } from "../interface/resort.interface";

const resortSchema = new Schema<IResort>({
  resortDetails: {
    name: { type: String, required: true, unique: true},
    heading: { type: String, required: true },
    description: { type: String, required: true },
    image: {type: String, required: true},
    features: [String],
  },
  manager: { type: mongoose.Types.ObjectId },
  location: { type: String, required: true },
  email: { type: String, required: true },
  customerCareNo: { type: Number, required: true },
  gallaryId:mongoose.Types.ObjectId,
});

export default model<IResort>("Resort", resortSchema);
