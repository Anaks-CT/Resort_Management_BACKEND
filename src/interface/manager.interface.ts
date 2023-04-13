import {ObjectId} from "mongodb"


export interface IManager {
    _id?: string
    name: string
    phone: number
    email: string
    profile?: string
    password: string
    resortId: ObjectId
}   