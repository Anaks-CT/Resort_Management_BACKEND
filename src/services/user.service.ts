import ErrorResponse from "../error/errorResponse";
import UserRepository from "../repositories/user.repository";
import { IUser } from "../interface/user.interface";
import { sendVerificationToken } from "../utils/twilio";
import bcrypt from "bcrypt";


export default class UserService {
    constructor(private userRepositary = new UserRepository()) {}


    async getSingleUserDetails(id: string): Promise<IUser>{
        const user = await this.userRepositary.getById<IUser>(id)

        if(!user) throw ErrorResponse.notFound('User not found')
        return user
    }

    async forgotPasswordverifyEmail(email: string){
        const user = await this.userRepositary.getByEmail<IUser>(email)
        if(!user) throw ErrorResponse.notFound('User not found')
        const sendOTP = await sendVerificationToken(user.phone.toString())
        if(!sendOTP) throw ErrorResponse.internalError('Some error occured, please try again')
        return user.phone
    }

    async changePassword (email: string, password: string){
        const user = await this.userRepositary.getByEmail(email)
        if(!user) throw ErrorResponse.notFound('User not found')
        const hashedPassword = await bcrypt.hash(password, 10)
        const updateResult = await this.userRepositary.changePassword(email, hashedPassword)
        if(updateResult.modifiedCount === 0 ) throw ErrorResponse.internalError("Password not changed, Please try again")
    }

    async updateUserWishlist (userId: string, wishlistId: string){
        const user = await this.userRepositary.getById(userId)
        if(!user) throw ErrorResponse.notFound('User not found')
        const updateResult = await this.userRepositary.addToWishlist(userId, wishlistId)
        if(updateResult.modifiedCount !== 1) throw ErrorResponse.internalError('Dates not added to wishlist, Please try again later')
    }

    async deleteWishlistFromUser(userId: string, wishlistId: string){
        const user = await this.userRepositary.getById(userId)
        if(!user) throw ErrorResponse.notFound('User not found')
        const updateResult = await this.userRepositary.deleteFromWishlist(userId, wishlistId)
        if(updateResult.modifiedCount !== 1) throw ErrorResponse.internalError('Dates not discarded from wishlist')
    }

    async addBookingId (userId: string, bookingId: string){
        const user = await this.userRepositary.getById(userId)
        if(!user) throw ErrorResponse.notFound('User not found')
        const updateResult = await this.userRepositary.addBookingId(userId, bookingId)
        if(updateResult.modifiedCount !== 1) throw ErrorResponse.internalError('Booking Id is not added to user Collection due to server error')
    }

    async removeBookingId(userId: string, bookingId: string){
        const user = await this.userRepositary.getById(userId)
        if(!user) throw ErrorResponse.notFound('User not found')
        const updateResult = await this.userRepositary.removeBookingId(userId, bookingId)
        if(updateResult.modifiedCount !== 1) throw ErrorResponse.internalError('bookingId is not discarded from user"s data')
    }

    async updateUserDetails(userId: string, name: string, url?: string, ){
        const checkUser = await this.userRepositary.getById(userId)
        if(!checkUser) throw ErrorResponse.notFound('User not found')
        const newData = await this.userRepositary.updateUserDetails(userId, name, url)
        console.log(newData?.isModified);
        if(!newData?.isModified) throw ErrorResponse.internalError("Update failed due to internal Error, please try again later")
        return newData
    }
}
