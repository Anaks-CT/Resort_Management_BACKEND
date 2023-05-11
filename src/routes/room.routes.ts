import express from "express";
import {
    addRoom,
    getAvailableRooms,
    getRoomsByResortId,
    udpateRoomStatus,
    updateRoom,
} from "../controllers/room/roomCRUD";
import { paramsIdValidate, roomValidate } from "../middlewares/bodyValidation";
import { adminOrMangerVerify, userVerify } from "../middlewares/auth-middlewares";

export const room = express.Router();


room.route("/availableRooms").post(userVerify,getAvailableRooms)
room.route("/:resortId?")
    .get(getRoomsByResortId)
    .post(adminOrMangerVerify, roomValidate, addRoom)
    .put(adminOrMangerVerify, updateRoom)
room.route("/block/:id").patch(adminOrMangerVerify, paramsIdValidate, udpateRoomStatus) 