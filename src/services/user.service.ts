import mongoose from "mongoose";
import ErrorResponse from "../error/errorResponse";
import UserRepository from "../repositories/user.repository";
import { IUser } from "../interface/user.interface";


export default class UserService {
    constructor(private userRepositary = new UserRepository()) {}


    async getSingleUserDetails(id: string): Promise<IUser>{
        const user = await this.userRepositary.getOne<IUser>({_id: id})
        if(!user)
            throw ErrorResponse.notFound('User not found')
        return user
    }


}
