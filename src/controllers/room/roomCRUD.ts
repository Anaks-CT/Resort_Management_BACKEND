
import RoomService from "../../services/room.service";
import asyncHandler from "express-async-handler";

const roomService = new RoomService();

export const addRoom = asyncHandler(async (req, res) => {
    const {roomData} = req.body
    console.log(roomData);
    console.log(req.body);
    const {resortId} = req.params
    const response = await roomService.createRoom(roomData, resortId)
    res.status(201).json({ message: "Room Added Successfully", data: response});
});

export const getRoomsByResortId = asyncHandler( async(req, res) => {
    const {resortId} = req.params
    const response = await roomService.getRoomsByResortId(resortId)
    res.status(200).json({message: "Successful", data: response})
})

export const getAvailableRooms = asyncHandler(async (req, res) => {
    console.log(req.body.formValues);
    const { destination: resortId, roomDetail, date } = req.body.formValues;
    const getAvailableRooms = await roomService.getAvailableRooms(resortId, roomDetail, date)
    res.json({data: getAvailableRooms });
});



export const updateRoom = asyncHandler( async (req, res) => {
    const {resortId} = req.params
    const {roomId, formValues} = req.body
    console.log(formValues);
    await roomService.updateRoomDetails(resortId, roomId, formValues)
    res.status(200).json({message:"Update Room Successfull"})
}) 