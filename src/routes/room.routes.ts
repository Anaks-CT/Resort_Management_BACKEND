import express from "express";
import {
    addRoom,
    getAvailableRooms,
    getRoomsByResortId,
    updateRoom,
} from "../controllers/room/roomCRUD";
import { roomValidate } from "../middlewares/bodyValidation";
import { adminVerify, userVerify } from "../middlewares/auth-middlewares";

export const room = express.Router();


room.route("/availableRooms").post(userVerify,getAvailableRooms)
room.route("/:resortId?")
    .get(getRoomsByResortId)
    .post(adminVerify, roomValidate, addRoom)
    .put(adminVerify, updateRoom);