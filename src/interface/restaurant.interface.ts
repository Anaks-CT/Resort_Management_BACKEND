import mongoose, { Document } from "mongoose";

export interface IRestaurant extends Document {
    name: string
    heading: string
    description: string
    feature: string[]
    image: string
}

