import { model, Schema } from "mongoose";
import { IRestaurant } from "../interface/restaurant.interface";

const restaurantSchema = new Schema<IRestaurant>({
    name: {type: String, required: true},
    heading: {type: String, required: true},
    description: {type: String, required: true},
    feature: [
        {type: String, required: true}
    ],
    image: {type: String, required: true}
});

export default model<IRestaurant>("Restaurant", restaurantSchema);
