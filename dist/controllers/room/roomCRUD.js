"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.udpateRoomStatus = exports.updateRoom = exports.getAvailableRooms = exports.getRoomsByResortId = exports.addRoom = void 0;
const room_service_1 = __importDefault(require("../../services/room.service"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const user_service_1 = __importDefault(require("../../services/user.service"));
const roomService = new room_service_1.default();
const userService = new user_service_1.default();
exports.addRoom = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomData } = req.body;
    const { resortId } = req.params;
    const response = yield roomService.createRoom(roomData, resortId);
    res.status(201).json({ message: "Room Added Successfully", data: response });
}));
exports.getRoomsByResortId = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { resortId } = req.params;
    const roomDetails = yield roomService.getRoomsByResortId(resortId);
    res.status(200).json({ message: "Successful", data: roomDetails });
}));
exports.getAvailableRooms = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { _id } = req.user;
    const { destination: resortId, roomDetail, date } = req.body.formValues;
    const getAvailableRooms = yield roomService.getAvailableRooms(resortId, roomDetail, date);
    const userDetails = yield userService.getSingleUserDetails(_id);
    res.json({ data: getAvailableRooms, type: userDetails.type, points: userDetails.points });
}));
exports.updateRoom = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { resortId } = req.params;
    const { roomId, formValues } = req.body;
    console.log(formValues);
    yield roomService.updateRoomDetails(resortId, roomId, formValues);
    res.status(200).json({ message: "Update Room Successfull" });
}));
exports.udpateRoomStatus = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id: roomId } = req.params;
    const resortId = yield roomService.changeRoomStatus(roomId);
    const roomDetails = yield roomService.getRoomsByResortId(resortId);
    res.status(200).json({ message: "Room staus updates successfully", data: roomDetails });
}));
