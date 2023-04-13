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
const errorResponse_1 = __importDefault(require("../error/errorResponse"));
const room_repositary_1 = __importDefault(require("../repositories/room.repositary"));
const mongodb_1 = require("mongodb");
const resort_repositary_1 = __importDefault(require("../repositories/resort.repositary"));
const numberToAlphabet_1 = require("../utils/numberToAlphabet");
class RoomService {
    constructor(roomRepositary = new room_repositary_1.default(), resortRepositary = new resort_repositary_1.default()) {
        this.roomRepositary = roomRepositary;
        this.resortRepositary = resortRepositary;
    }
    createRoom(roomDetails, resortId) {
        return __awaiter(this, void 0, void 0, function* () {
            // search for duplication of room with name
            const roomByResortId = yield this.roomRepositary.getOne({
                resortId: resortId,
                name: roomDetails.name,
            });
            // throwing error if the room details not found with the resort Id and room Id
            if (!roomDetails)
                throw errorResponse_1.default.badRequest("Room Details cannot be empty");
            // throwing error if the room name is already present
            if ((roomByResortId === null || roomByResortId === void 0 ? void 0 : roomByResortId.name) === roomDetails.name)
                throw errorResponse_1.default.badRequest("Room type already exists");
            // count of present room type to give the alphabet for the next room type in room numbers
            const roomTypeCount = yield this.roomRepositary.getCountOfRoomByResortId(resortId);
            const { noOfRooms } = roomDetails;
            // pushing all the room numbers generated using the util function and passing to repositary
            const roomNumbers = [];
            for (let i = 0; i < noOfRooms; i++) {
                roomNumbers.push({
                    number: 100 + i + 1 + (0, numberToAlphabet_1.numberToAlphabet)(roomTypeCount + 1),
                    unavailableDates: [],
                });
            }
            // initializing the new room with all details and passing to reposiaary
            const newRoom = Object.assign(Object.assign({}, roomDetails), { roomNumbers: roomNumbers, resortId: new mongodb_1.ObjectId(resortId) });
            const room = yield this.roomRepositary.create(newRoom);
            // throwing error if the reposiatry doesnt return the newly created room
            if (!room)
                throw errorResponse_1.default.badRequest("Room not created");
            // adding the newly created room to the corresponding resortiD
            const editResortResponse = yield this.resortRepositary.addingRoomInResort(room._id, resortId);
            // throwing error if resort isn't updated
            if (editResortResponse.modifiedCount !== 1)
                throw errorResponse_1.default.internalError("Room not added to Resort");
            return room;
        });
    }
    getRoomsByResortId(resortId) {
        return __awaiter(this, void 0, void 0, function* () {
            const roomDetails = yield this.roomRepositary.getAll({
                resortId: new mongodb_1.ObjectId(resortId),
            });
            if (roomDetails.length < 1)
                throw errorResponse_1.default.badRequest("No Rooms available");
            return roomDetails;
        });
    }
    updateRoomDetails(resortId, roomId, roomDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            //checking if the room type exeeds 50
            const roomTypeCount = yield this.roomRepositary.count();
            // throwing error if room type exeeds 50
            if (roomTypeCount === 50)
                throw errorResponse_1.default.badRequest('Cannot add more than 50 Room Types');
            // checking if the room exist in resort
            const room = yield this.roomRepositary.getRoomByResortIdRoomId(resortId, roomId);
            // throwing erro if room id or resortid given is wrong
            if (!room)
                throw errorResponse_1.default.badRequest("Room or Resort doesn't exist");
            const roomLength = room === null || room === void 0 ? void 0 : room.roomNumbers.length;
            // throwing an error if roomDetails.noOfRoom less than previous number
            if (roomLength > roomDetails.noOfRooms)
                throw errorResponse_1.default.badRequest(`Rooms should be more than ${roomLength}`);
            // initializing an array with all the existing room numbers to not lose the id
            const roomNumbers = [...room.roomNumbers];
            // finding the room number alphabet after 3 digits (101b) for example
            const roomNumberAlphabet = room.roomNumbers[0].number.substring(3, room.roomNumbers[0].number.length);
            // pushing to the created array of newly created room numbers with alphabet
            for (let i = 0; i < roomDetails.noOfRooms - roomLength; i++) {
                roomNumbers.push({
                    number: 100 + i + 1 + roomLength + roomNumberAlphabet,
                    unavailableDates: [],
                });
            }
            // deleting the images if it is an empty array
            // if not deleted it will be stored in the database when image was not intended to edit
            if (roomDetails.images.length < 1) {
                delete roomDetails.images;
            }
            // passing fileds to the repositary to update
            const editRoom = yield this.roomRepositary.updateRoomDetailById(roomId, roomDetails, roomNumbers);
            return editRoom;
        });
    }
}
exports.default = RoomService;
