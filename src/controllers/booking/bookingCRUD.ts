import expressAsyncHandler from "express-async-handler";
import RoomService from "../../services/room.service";
import { RequestWithUser } from "../../middlewares/auth-middlewares";
import BookingService from "../../services/booking.service";
import { IBooking } from "../../interface/booking.interface";

const roomService = new RoomService();
const bookingService = new BookingService();

export const bookingConfirmationPart1 = expressAsyncHandler(
    async (req: RequestWithUser, res) => {
        const {
            destination: resortId,
            roomDetail,
            date,
        } = req.body.bookingForm1Details;
        await roomService.getAvailableRooms(resortId, roomDetail, date);
        const roomNumber = await Promise.all(
            req.body.stayDetails?.map((singleStayDetail: any) =>
                roomService.addDatesToRoom(date, singleStayDetail.roomId)
            )
        );
        const bookingDetails = (await bookingService.createBooking(
            req.user._id,
            resortId.id,
            date,
            req.body.stayDetails,
            roomNumber
        )) as unknown;
        const booking = bookingDetails as IBooking;

        const orderDetails = await bookingService.initializePayment(
            booking.amount.totalCost
        );

        setTimeout(async() => {
            const result = await bookingService.deleteBooking(bookingDetails && bookingDetails)
            if (bookingDetails && result) {
                const details = bookingDetails as IBooking;
                Promise.all(
                    details.roomDetail.map((singleRoomDetail: any) =>
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
            bookingId: booking.id
        });
    }
);

export const verifyPayment = expressAsyncHandler(async (req, res) => {
    const { orderCreationId, razorpayPaymentId, razorpaySignature, bookingId } = req.body;
    await bookingService.verifyPayment(
        orderCreationId,
        razorpayPaymentId,
        razorpaySignature,
        bookingId
    );
    res.status(200).json({message: "Booking verified successfull"})
});

export const getBookingDetailsOfUser = expressAsyncHandler(async (req: RequestWithUser, res) => {
    const {_id} = req.user
    const bookingDetails = await bookingService.getBookingDetails(_id)
    res.status(200).json({message: "Booking details fetched successfully", data: bookingDetails })
})
