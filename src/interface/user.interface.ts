import { JwtPayload } from "jsonwebtoken";
import { Document, ObjectId } from "mongoose";


export interface IUser extends Document {
    _doc: IUser
    name: string;
    phone: number;
    email: string;
    password: string;
    points: number
    image: string
    totalmoneySpent: number
    type: "member" | "platinum" | "diamond"
    bookings: string[]
    role: string
    wishlist: string[]
    status: boolean
    blockedBy: ObjectId | string
  }
  
  
  export interface IsignupResponse {
    user: IUser;
    // role: string
    //   token: string;
  }
  export interface IloginResponse {
    user: any;
      token: string | JwtPayload;
  }