import { ObjectId } from "mongodb"

export interface IRoom {
    _id?: string
    name: string
    description: string
    area: number
    resortId: ObjectId
    images: string[]
    packages: [{
        packageName: string
        cost: number
        features: string[]
    }],
    maxPeople: number
    roomNumbers: {_id?: string, number: string, unavailableDates: Date[]}[]
    highlights: string[]
    amenities: string[]
    facilities: string[]
    active?: true
}