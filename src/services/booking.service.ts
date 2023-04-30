import ErrorResponse from "../error/errorResponse";
import { IBooking } from "../interface/booking.interface";
import { IRoom } from "../interface/room.interface";
import { IUser } from "../interface/user.interface";
import bookingModel from "../models/booking.model";
import BookingRepositary from "../repositories/booking.repositary";
import RoomRespositary from "../repositories/room.repositary";
import UserRepository from "../repositories/user.repository";

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
        let bookingDetail
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
            const newBookingDetails ={
                userId: userId,
                resortId: resortId,
                checkInDate: date.startDate,
                checkOutDate: date.endDate,
                roomDetail: roomDetails,
                amount: amount,
            };
            return this.bookingRepositary.create(newBookingDetails)
                .then((res) => bookingDetail = res)
        });
        return bookingDetail;
    }

    async deleteBooking(bookingSchemaDetails: any){
        const bookingDetails = await this.bookingRepositary.getOne<IBooking>({_id: bookingSchemaDetails._id})
        if(!bookingDetails) throw ErrorResponse.internalError("Cannot find the booknig details")
        if(!bookingDetails.paymentSuccess)
            await this.bookingRepositary.deleteById(bookingSchemaDetails._id!)
    }
}
