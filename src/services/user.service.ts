import ErrorResponse from "../error/errorResponse";
import UserRepository from "../repositories/user.repository";
import { IUser } from "../interface/user.interface";
import { sendVerificationToken } from "../utils/twilio";
import bcrypt from "bcrypt";
import { BookingAmount } from "../interface/booking.interface";


export default class UserService {
    constructor(private userRepositary = new UserRepository()) {}


    async getSingleUserDetails(id: string): Promise<IUser>{
        const user = await this.userRepositary.getById<IUser>(id)
        console.log(user);
        if(!user) throw ErrorResponse.notFound('User not found')
        return user
    }

    async getNumberOfUsers(){
        return await this.userRepositary.count()
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
        const {modifiedCount} = await this.userRepositary.changePassword(email, hashedPassword)
        if(modifiedCount === 0 ) throw ErrorResponse.internalError("Password not changed, Please try again")
    }

    async updateUserWishlist (userId: string, wishlistId: string){
        const user = await this.userRepositary.getById(userId)
        if(!user) throw ErrorResponse.notFound('User not found')
        const {modifiedCount} = await this.userRepositary.addToWishlist(userId, wishlistId)
        if(modifiedCount !== 1) throw ErrorResponse.internalError('Dates not added to wishlist, Please try again later')
    }

    async deleteWishlistFromUser(userId: string, wishlistId: string){
        const user = await this.userRepositary.getById(userId)
        if(!user) throw ErrorResponse.notFound('User not found')
        const {modifiedCount} = await this.userRepositary.deleteFromWishlist(userId, wishlistId)
        if(modifiedCount !== 1) throw ErrorResponse.internalError('Dates not discarded from wishlist')
    }

    async updateMemberDetails(userId: string){
        const user = await this.userRepositary.getById<IUser>(userId)
        if(!user) throw ErrorResponse.notFound('User not found')
        if(user.totalmoneySpent > 100000){
            await this.userRepositary.updateMemberDetailsToDiamond(userId)
        }else if(user.totalmoneySpent > 30000){
            await this.userRepositary.updateMemberDetailsToPlatinum(userId)
        }
    }

    async updateUserPoints(userId: string, points: number){
        const user = await this.userRepositary.getById<IUser>(userId)
        if(!user) throw ErrorResponse.notFound('User not found')
        const {modifiedCount} = await this.userRepositary.updateUserPoints(userId, points)
        if(modifiedCount === 0) throw ErrorResponse.internalError("Count not update user points")
    }

    async calculateUserPointsAndType(userId: string){
        const user = await this.userRepositary.getById<IUser>(userId)
        if(!user) throw ErrorResponse.notFound('User not found')
        return {points:user.points, type: user.type}
    }


    async addBookingDetails (userId: string, bookingId: string){
        const user = await this.userRepositary.getById<IUser>(userId)
        if(!user) throw ErrorResponse.notFound('User not found')
        const {modifiedCount} = await this.userRepositary.addBookingId(userId, bookingId)
        if(modifiedCount !== 1) throw ErrorResponse.internalError('Booking Id is not added to user Collection due to server error')
    }

    async updateMoneySpentandPoints (userId: string, taxCost: number, amount: number, userPoints: number){
        const user = await this.userRepositary.getById<IUser>(userId)
        if(!user) throw ErrorResponse.notFound('User not found')
        // decreasing the points used if any
        const {modifiedCount} = await this.userRepositary.updatePointsAndMoneySpent(userId, Math.floor(taxCost/3 - userPoints), amount)
        if(modifiedCount === 0) throw ErrorResponse.internalError('Cannot update your points, Please contact TRINITY helping desk')
    }

    async updateCancelBooking(userId: string, bookingAmountDetails: BookingAmount){
        const user = await this.userRepositary.getById<IUser>(userId)
        if(!user) throw ErrorResponse.notFound('User not found')
        const {pointsUsed, taxCost, totalCost} = bookingAmountDetails
        // 2000 cancellation fee
        console.log(pointsUsed, taxCost, totalCost);
        const points = Math.floor(pointsUsed+(-taxCost/3)+totalCost-2000)
        console.log(points);
        const {modifiedCount} = await this.userRepositary.incUserPoints(userId, points)
        if(modifiedCount === 0) throw ErrorResponse.internalError("Couldn't add amount to points, please contact the TRINITY helping desk")
    }

    async removeBookingDetails(userId: string, bookingId: string){
        const user = await this.userRepositary.getById<IUser>(userId)
        if(!user) throw ErrorResponse.notFound('User not found')
        const {modifiedCount} = await this.userRepositary.removeBookingId(userId, bookingId)
        if(modifiedCount !== 1) throw ErrorResponse.internalError('bookingId is not discarded from user"s data')
    }

    async updateUserDetails(userId: string, name: string, url?: string, ){
        const checkUser = await this.userRepositary.getById<IUser>(userId)
        if(!checkUser) throw ErrorResponse.notFound('User not found')
        const newData = await this.userRepositary.updateUserDetails(userId, name, url)
        if(!newData?.isModified) throw ErrorResponse.internalError("Update failed due to internal Error, please try again later")
        return newData
    }

    async getAllUserDetails(){
        const userDetails = await this.userRepositary.getAll<IUser>({})
        if(userDetails.length === 0) throw ErrorResponse.notFound("No user Details found")
        return userDetails.map(({ _doc: {wishlist, bookings, password, ...userDetails} }) => userDetails);
    }

    async updateUserStatus(userId: string, blockedBy?: string ){
        const checkUser = await this.userRepositary.getById<IUser>(userId)
        if(!checkUser) throw ErrorResponse.notFound('User not found')
        const {modifiedCount} = await this.userRepositary.updateUserStatus(userId)
        if(modifiedCount === 0) throw ErrorResponse.internalError("couldn't update user status")
        if(checkUser.status){
            const {modifiedCount} = await this.userRepositary.updateUserBlockedBy(userId, blockedBy)
            if(modifiedCount === 0) throw ErrorResponse.internalError("Couldn't change blocked by status")
        }
    }

    async getSerchSortedUserDetails(searchValue: string, sortOrder: string, sortBy: string){
        let sortorder: 1 | -1 | null
        if(sortOrder === "asc"){
            sortorder = 1
        }else if(sortOrder === "des"){
            sortorder = -1
        }else{
            sortorder = null
        }
        let sortValue: string | null
      switch (sortBy) {
        case "Name":
            sortValue = "name"
            break;
        case "Email":
            sortValue = "email"
            break;
        case "Member Type":
            sortValue = "type"
            break;
        case "Total investment":
            sortValue = "totalmoneySpent"
            break;
        case "Joined At":
            sortValue = "createdAt"
            break;
        case "Status":
            sortValue = "status"
            break;
        default:
            sortValue = null
            break;
      }
        const userDetails =  await this.userRepositary.searchSortService(searchValue, sortorder, sortValue)
        return userDetails.map(({ _doc: {wishlist, bookings, password, ...userDetails} }) => userDetails);
    }
}
