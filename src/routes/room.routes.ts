import express from "express";
import { addRoom, getRoomsByResortId, updateRoom } from "../controllers/room/roomCRUD";
import upload from '../utils/multer'
import { roomValidate } from "../middlewares/bodyValidation";
// const upload = require('../utils/multer')

export const room = express.Router();

room.route("/:resortId?").get(getRoomsByResortId).post(roomValidate,addRoom).put(updateRoom)