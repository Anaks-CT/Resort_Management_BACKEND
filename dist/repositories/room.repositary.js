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
const baseRepositary_1 = require("./baseRepositary");
const mongodb_1 = require("mongodb");
const room_model_1 = __importDefault(require("../models/room.model"));
class RoomRespositary extends baseRepositary_1.BaseRepository {
    constructor() {
        super(room_model_1.default);
    }
    getCountOfRoomByResortId(resortId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield room_model_1.default.find({ resortId: resortId }).count();
        });
    }
    getRoomByResortIdRoomId(resortId, roomId) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield room_model_1.default.findOne({ resortId: new mongodb_1.ObjectId(resortId), _id: new mongodb_1.ObjectId(roomId) });
        });
    }
    updateRoomDetailById(roomId, roomDetail, roomNumber) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield room_model_1.default.updateOne({ _id: roomId }, { $set: Object.assign(Object.assign({}, roomDetail), { roomNumbers: roomNumber }) });
        });
    }
}
exports.default = RoomRespositary;
