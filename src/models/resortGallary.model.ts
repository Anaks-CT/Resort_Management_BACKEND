import mongoose, { model, Schema } from "mongoose";
import { IGallary } from "../interface/gallary.interface";

const gallarySchema = new Schema<IGallary>({
  resortid: { type: mongoose.Types.ObjectId, required: true},
  largeBanner: [
    {
      image: String,
      description1: String,
      description2: String,
    },
  ],
  smallBanner: [
    {
      image: String,
      description1: String,
      description2: String,
    },
  ],
  communityPics: [String],
});

export default model<IGallary>("Gallary", gallarySchema);
