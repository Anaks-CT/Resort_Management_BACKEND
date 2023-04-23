"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.room = void 0;
const express_1 = __importDefault(require("express"));
const roomCRUD_1 = require("../controllers/room/roomCRUD");
const bodyValidation_1 = require("../middlewares/bodyValidation");
const auth_middlewares_1 = require("../middlewares/auth-middlewares");
exports.room = express_1.default.Router();
exports.room.route("/availableRooms").post(roomCRUD_1.getAvailableRooms);
exports.room.route("/:resortId?")
    .get(roomCRUD_1.getRoomsByResortId)
    .post(auth_middlewares_1.adminVerify, bodyValidation_1.roomValidate, roomCRUD_1.addRoom)
    .put(auth_middlewares_1.adminVerify, roomCRUD_1.updateRoom);
