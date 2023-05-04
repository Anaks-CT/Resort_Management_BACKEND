import { ObjectId } from "mongodb";


export interface IWishlist{
    _id?: string
    userId: ObjectId
    resortId: ObjectId
    noOfRooms: number
    noOfGuests: number
    dates: {
        startDate: Date
        endDate: Date
    }
}