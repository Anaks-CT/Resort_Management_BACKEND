import { JwtPayload } from "jsonwebtoken";
import { Document } from "mongoose";


export interface IUser extends Document {
    _doc: IUser
    name: string;
    phone: number;
    email: string;
    password: string;
    points: number
    image: string
    address?: {
      addressLine1: string;
      addressLine2: string;
      addressLine3: string;
      city: string;
      pincode: number;
      country: string;
    };
    bookings: string[]
    role: string
    wishlist: string[]
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