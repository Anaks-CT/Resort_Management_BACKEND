import expressAsyncHandler from "express-async-handler";
import RoomService from "../../services/room.service";
import { RequestWithUser } from "../../middlewares/auth-middlewares";
import BookingService from "../../services/booking.service";
import { IBooking } from "../../interface/booking.interface";

const roomService = new RoomService();
const bookingService = new BookingService()

export const bookingConfirmationPart1 = expressAsyncHandler(async(req: RequestWithUser, res) => {
    const { destination: resortId, roomDetail, date } = req.body.bookingForm1Details;
    await roomService.getAvailableRooms(resortId, roomDetail, date)
    const roomNumber = await Promise.all(req.body.stayDetails?.map((singleStayDetail: any) => 
        roomService.addDatesToRoom(date, singleStayDetail.roomId)
    ))
    const bookingDetails = await bookingService.createBooking(req.user._id, resortId.id, date, req.body.stayDetails, roomNumber)
    setTimeout(() => {
        bookingService.deleteBooking(bookingDetails && bookingDetails)
        if(bookingDetails){
            const details = bookingDetails as IBooking
            Promise.all(details.roomDetail.map((singleRoomDetail: any) => roomService.removeDatesFromRoom(singleRoomDetail.roomTypeId, singleRoomDetail.roomId, date)))
        }
    }, 10000);
    res.json({message: "Booking confirmation part 1 successful"})
})