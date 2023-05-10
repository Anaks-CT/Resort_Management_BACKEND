import expressAsyncHandler from "express-async-handler";
import RoomService from "../../services/room.service";
import { RequestWithUser } from "../../middlewares/auth-middlewares";
import BookingService from "../../services/booking.service";
import { IBooking } from "../../interface/booking.interface";
import UserService from "../../services/user.service";
import ResortRepositary from "../../repositories/resort.repositary";
import ResortService from "../../services/resort.service";

interface userPoints {
    userPointsLeft: number;
}

const roomService = new RoomService();
const bookingService = new BookingService();
const userService = new UserService();
const resortService = new ResortService();

export const bookingConfirmationPart1 = expressAsyncHandler(
    async (req: RequestWithUser, res) => {
        const {
            destination: resortId,
            roomDetail,
            date,
            applyPoints,
        } = req.body.bookingForm1Details;
        await roomService.getAvailableRooms(resortId, roomDetail, date);
        const roomNumber = await Promise.all(
            req.body.stayDetails?.map((singleStayDetail: any) =>
                roomService.addDatesToRoom(date, singleStayDetail.roomId)
            )
        );
        const { points, type } = await userService.calculateUserPointsAndType(
            req.user._id
        );

        const bookingDetails = (await bookingService.createBooking(
            req.user._id,
            resortId.id,
            date,
            req.body.stayDetails,
            roomNumber,
            type,
            applyPoints && points
        )) as unknown;
        const booking = bookingDetails as IBooking & userPoints;
        await userService.addBookingDetails(req.user._id, booking._doc._id!);
        const orderDetails = await bookingService.initializePayment(
            booking._doc.amount.totalCost
        );
        if (booking._doc.userPointsLeft) {
            await userService.updateUserPoints(
                req.user._id,
                booking._doc.userPointsLeft
            );
        }
        setTimeout(async () => {
            const result = await bookingService.deleteBooking(
                bookingDetails && booking._doc._id
            );
            await userService.updateMemberDetails(req.user._id);
            if (bookingDetails && result) {
                await userService.removeBookingDetails(
                    req.user._id,
                    booking._doc._id!
                );
                const details = bookingDetails as IBooking;
                Promise.all(
                    details._doc.roomDetail.map((singleRoomDetail: any) =>
                        roomService.removeDatesFromRoom(
                            singleRoomDetail.roomTypeId,
                            singleRoomDetail.roomId,
                            date
                        )
                    )
                );
            }
        }, 30000);
        res.json({
            message: "Booking confirmation part 1 successful",
            data: orderDetails,
            bookingId: booking._doc._id,
        });
    }
);

export const verifyPayment = expressAsyncHandler(async (req, res) => {
    const { orderCreationId, razorpayPaymentId, razorpaySignature, bookingId } =
        req.body;
    await bookingService.verifyPayment(
        orderCreationId,
        razorpayPaymentId,
        razorpaySignature,
        bookingId
    );
    const {
        userId,
        amount: { taxCost, totalCost, pointsUsed },
    } = await bookingService.getBookingById(bookingId);
    await userService.updateMoneySpentandPoints(
        userId,
        taxCost,
        totalCost,
        pointsUsed
    );
    res.status(200).json({ message: "Booking verified successfull" });
});

export const getBookingDetailsOfUser = expressAsyncHandler(
    async (req: RequestWithUser, res) => {
        const { _id: userId } = req.user;
        const bookingDetails = await bookingService.getBookingDetailsbyId(
            userId,
            "user"
        );
        res.status(200).json({
            message: "Booking details fetched successfully",
            data: bookingDetails,
        });
    }
);

export const cancelBooking = expressAsyncHandler(
    async (req: RequestWithUser, res) => {
        const { _id: userId } = req.user;
        const { id: bookingId } = req.params;
        const { amount } = await bookingService.cancelBooking(bookingId);
        await userService.updateCancelBooking(userId, amount);
        const bookingDetails = await bookingService.getBookingDetailsbyId(
            userId,
            "user"
        );
        res.status(200).json({
            message: "Cancelation successfull",
            data: bookingDetails,
        });
    }
);

export const getResortBookings = expressAsyncHandler(
    async (req: RequestWithUser, res) => {
        const { id: resortId } = req.params;
        const bookingDetails = await bookingService.getBookingDetailsbyId(
            resortId,
            "resort"
        );
        res.status(200).json({
            message: "Booking details fetched successfully",
            data: bookingDetails,
        });
    }
);

export const searchSortedBookingDetails = expressAsyncHandler(
    async (req, res) => {
        const { id: resortId } = req.params;
        const { sortBy, searchInput, sortOrder } = req.body;
        const searchResult = await bookingService.searchSortBookingService(
            resortId,
            searchInput,
            sortBy,
            sortOrder
        );
        res.status(200).json({
            message: "Booking details fetched successfully",
            data: searchResult,
        });
    }
);


