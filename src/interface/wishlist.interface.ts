import { ObjectId } from "mongodb";


export interface IWishlist{
    _id?: string
    userId: ObjectId
    resortId: ObjectId
    roomDetail: number[];
    dates: {
        startDate: Date;
        endDate: Date;
        key: string;
    };
}