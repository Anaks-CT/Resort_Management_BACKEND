import expressAsyncHandler from "express-async-handler";
import RoomService from "../../services/room.service";

const roomService = new RoomService();


export const bookingConfirmationPart1 = expressAsyncHandler(async(req, res) => {
    console.log(req.body);
    const { destination: resortId, roomDetail, date } = req.body.bookingForm1Details;
    await roomService.getAvailableRooms(resortId, roomDetail, date)
    await Promise.all(req.body.stayDetails?.map((singleStayDetail: any) => 
        roomService.addDatesToRoom(date, singleStayDetail.roomId)
    )) 
    res.json({message: "Booking confirmation part 1 successful"})
})