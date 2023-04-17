import { JwtPayload } from "jsonwebtoken";
import { Document } from "mongoose";


export interface IUser extends Document {
    name: string;
    phone: number;
    email: string;
    password: string;
    address?: {
      addressLine1: string;
      addressLine2: string;
      addressLine3: string;
      city: string;
      pincode: number;
      country: string;
    };
    role: string
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