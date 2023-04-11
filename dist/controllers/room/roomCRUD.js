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
exports.updateRoom = exports.getRoomsByResortId = exports.addRoom = void 0;
const room_service_1 = __importDefault(require("../../services/room.service"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const roomService = new room_service_1.default();
exports.addRoom = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { roomData } = req.body;
    console.log(roomData);
    console.log(req.body);
    const { resortId } = req.params;
    const response = yield roomService.createRoom(roomData, resortId);
    res.status(201).json({ message: "Room Added Successfully", data: response });
}));
exports.getRoomsByResortId = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { resortId } = req.params;
    const response = yield roomService.getRoomsByResortId(resortId);
    res.status(200).json({ message: "Successful", data: response });
}));
exports.updateRoom = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { resortId } = req.params;
    const { roomId, formValues } = req.body;
    console.log(formValues + 'sdfdsdssfd');
    const response = yield roomService.updateRoomDetails(resortId, roomId, formValues);
    res.status(200).json({ message: "Update Room Successfull" });
}));
