import mongoose, { model, Schema } from "mongoose";
import { ICompany } from "../interface/company.interface";

const companySchema = new Schema<ICompany>({
    companyName: { type: String, required: true },
    resortDetails: [mongoose.Types.ObjectId],
    bannerDetails: {
        image: { type: String, required: true },
        description: { type: String, required: true },
    },
    faqs: [
        {
            Q: String,
            A: String,
        },
    ],
});

export default model<ICompany>("Company", companySchema);
