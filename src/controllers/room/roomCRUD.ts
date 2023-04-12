
import { room } from "../../routes/room.routes";
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

export const updateRoom = asyncHandler( async (req, res) => {
    const {resortId} = req.params
    const {roomId, formValues} = req.body
    console.log(formValues);
    const response = await roomService.updateRoomDetails(resortId, roomId, formValues)
    res.status(200).json({message:"Update Room Successfull"})
}) 