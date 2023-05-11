
import { RequestWithUser } from "../../middlewares/auth-middlewares";
import RoomService from "../../services/room.service";
import asyncHandler from "express-async-handler";
import UserService from "../../services/user.service";

const roomService = new RoomService();
const userService = new UserService();

export const addRoom = asyncHandler(async (req, res) => {
    const {roomData} = req.body
    const {resortId} = req.params
    const response = await roomService.createRoom(roomData, resortId)
    res.status(201).json({ message: "Room Added Successfully", data: response});
});

export const getRoomsByResortId = asyncHandler( async(req, res) => {
    const {resortId} = req.params
    const roomDetails = await roomService.getRoomsByResortId(resortId)
    res.status(200).json({message: "Successful", data: roomDetails})
})

export const getAvailableRooms = asyncHandler(async (req: RequestWithUser, res) => {
    const {_id} = req.user
    const { destination: resortId, roomDetail, date } = req.body.formValues;
    const getAvailableRooms = await roomService.getAvailableRooms(resortId, roomDetail, date)
    const userDetails = await userService.getSingleUserDetails(_id)
    res.json({data: getAvailableRooms, type: userDetails.type, points: userDetails.points });
});

export const updateRoom = asyncHandler( async (req, res) => {
    const {resortId} = req.params
    const {roomId, formValues} = req.body
    console.log(formValues);
    await roomService.updateRoomDetails(resortId, roomId, formValues)
    res.status(200).json({message:"Update Room Successfull"})
}) 

export const udpateRoomStatus = asyncHandler(async( req, res) => {
    const {id: roomId} = req.params
    const resortId = await roomService.changeRoomStatus(roomId)
    const roomDetails = await roomService.getRoomsByResortId(resortId)
    res.status(200).json({message: "Room staus updates successfully", data: roomDetails})
})