import mongoose from "mongoose";
import ErrorResponse from "../error/errorResponse";
import { IResort, IResortDetail } from "../interface/resort.interface";
import resortModel from "../models/resort.model";

class ResortRepositary {
    ///////////////////////////// creating a single resort with all the information passed from front end//////////////////

    async createResort(
        resortDetails: IResortDetail,
        location: string,
        email: string,
        customerCareNo: number
    ): Promise<IResort> {
        const resort = new resortModel({
            resortDetails: {
                name: resortDetails.name,
                heading: resortDetails.heading,
                description: resortDetails.description,
                image: resortDetails.image,
                features: resortDetails.features,
            },
            location: location,
            email: email,
            customerCareNo: customerCareNo,
        });
        await resort.save();

        return resort.toJSON() as IResort;
    }

    ////////////////////////////// querying for all resorts information ////////////////////////

    async getAllresortDetails(): Promise<IResort[] | null> {
        const resort = await resortModel.find();
        return resort ? (resort as IResort[]) : null;
    }

    ///////////////////////////// querying for single resort details which contains of name, heading, description, image//////
    // this query was created to check for name duplication since name property is unique in database.
    // so since we know that we manually throw an error inside here. not sure if we will use it.
    // somewhere else if yes u should remove this manual error
    async searchResort(resortdetail: IResortDetail): Promise<IResort | null> {
        try {
            const resort = await resortModel.findOne({
                resortDetails: resortdetail,
            });
            return resort ? (resort.toJSON() as IResort) : null;
        } catch (error) {
            throw ErrorResponse.internalError(
                "Resort with the same name aldready exist"
            ); /// doubt1 why can't I manually throw an error knowing that mongodb will throw and error. the mongodb error is directly going to global catch
        }
    }

    ////////////////////////////// querying resort by its id /////////////////////////////

    async findResortById(
        id: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId>
    ): Promise<IResort | null> {
        const resort = await resortModel.findById(id);
        return resort ? (resort.toJSON() as IResort) : null;
    }

    ////////////////////////////// updating gallary id after creating gallary model in the database////////////

    async setGallaryId(
        resortId: string,
        gallaryId: mongoose.SchemaDefinitionProperty<mongoose.Types.ObjectId>
    ): Promise<Boolean | null> {
        const gallaryid = gallaryId.valueOf().toString();
        const resort = await resortModel.updateOne(
            { _id: resortId },
            { $set: { gallaryId: gallaryid } }
        );
        return resort ? resort.acknowledged : null;
    }
}

export default ResortRepositary;
