import { instance } from "../config/razorpay";
import ErrorResponse from "../error/errorResponse";
import { IBooking } from "../interface/booking.interface";
import { IRoom } from "../interface/room.interface";
import { IUser } from "../interface/user.interface";
import BookingRepositary from "../repositories/booking.repositary";
import RoomRespositary from "../repositories/room.repositary";
import UserRepository from "../repositories/user.repository";
import crypto from "crypto";

export default class BookingService {
    constructor(
        private bookingRepositary = new BookingRepositary(),
        private userRepositary = new UserRepository(),
        private roomRepositary = new RoomRespositary()
    ) {}

    async createBooking(
        userId: string,
        resortId: string,
        date: any,
        stayDetails: any[],
        roomNumberIds: string[]
    ) {
        const user = await this.userRepositary.getOne<IUser>({ _id: userId });
        if (!user)
            throw ErrorResponse.unauthorized(
                "Authorization Error. Please try again later"
            );
        let roomDetails;
        let bookingDetail;
        await Promise.all(
            stayDetails.map((singleDetails, i) => {
                let roomNumber;
                return this.roomRepositary
                    .getOne<IRoom>({ _id: singleDetails.roomId })
                    .then((res) => {
                        const room = res?.roomNumbers.filter((num) => {
                            return (
                                num._id?.toString() ==
                                roomNumberIds[i].toString()
                            );
                        });
                        roomNumber = room && room[0].number;
                        return {
                            roomTypeId: singleDetails.roomId,
                            roomName: singleDetails.roomName,
                            roomNumber: roomNumber,
                            roomId: room && room[0]._id,
                            packagename: singleDetails.packageName,
                            packageCost: singleDetails.packageCost,
                        };
                    })
                    .catch((err) => {
                        throw ErrorResponse.notFound(
                            "cannot find Room Details"
                        );
                    });
            })
        ).then((result) => {
            roomDetails = result;
            const totalRoomCost = stayDetails.reduce(
                (acc, item) => (acc += item.packageCost),
                0
            );
            const pointsUsed = 0;
            const amount = {
                totalRoomCost,
                taxCost: (totalRoomCost * 22) / 100,
                pointsUsed: pointsUsed,
                totalCost:
                    totalRoomCost + (totalRoomCost * 22) / 100 + pointsUsed,
            };
            const newBookingDetails = {
                userId: userId,
                resortId: resortId,
                checkInDate: date.startDate,
                checkOutDate: date.endDate,
                roomDetail: roomDetails,
                amount: amount,
            };
            return this.bookingRepositary
                .create(newBookingDetails)
                .then((res) => (bookingDetail = res));
        });
        return bookingDetail;
    }

    async deleteBooking(bookingSchemaDetails: any) {
        const bookingDetails = await this.bookingRepositary.getOne<IBooking>({
            _id: bookingSchemaDetails._id,
        });
        if (!bookingDetails)
            throw ErrorResponse.internalError(
                "Cannot find the booknig details"
            );
        if (!bookingDetails.paymentSuccess)
            {await this.bookingRepositary.deleteById(bookingSchemaDetails._id!); return true}
        return false
    }

    async initializePayment(totalAmount: number) {
        const receiptId = Math.floor(Math.random() * (9999 - 1000 + 1)) + 1000; // random reciept id generating
        const options = {
            amount: totalAmount * 100, // amount in smallest currency unit
            currency: "INR",
            receipt: `receipt_order_${receiptId}`,
            payment_capture: 1,
        };

        const order = await instance.orders.create(options);
        if (!order) throw new Error("something went wrong");
        return order
    }

    async verifyPayment(
        orderCreationId: string,
        razorpayPaymentId: string,
        razorpaySignature: string,
        bookingId: string
    ) {

        const signature = crypto
            .createHmac("sha256", process.env.RAZORPAY_SECRET as string)
            .update(`${orderCreationId}|${razorpayPaymentId}`)
            .digest("hex");

        if (signature !== razorpaySignature) {
            throw ErrorResponse.badRequest("Transcation is not legit");
        }
        console.log(bookingId);
        const updateResult =await this.bookingRepositary.updateBookingPayment(bookingId)
        if(updateResult.modifiedCount ===0 ) throw ErrorResponse.internalError("An Error occured, if your money is been debited, please contact us")

    }

    async getBookingDetails(userId: string){
        const bookingDetails =  await this.bookingRepositary.getAll<IBooking>({userId: userId})
        if(!bookingDetails) throw ErrorResponse.notFound("Cannot find Bookings, Please try again later")
        const filteredBookingDetails = bookingDetails.map((item: any) => {
            const {paymentSuccess, status, ...rest} = item._doc
            return rest
        })
        return filteredBookingDetails
    }
}
