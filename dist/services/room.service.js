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
const getDatesInRange_1 = require("../utils/getDatesInRange");
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
    getAvailableRooms(resortId, roomDetails, date) {
        return __awaiter(this, void 0, void 0, function* () {
            // getting all the dates between the start date and end date and including them
            const allDates = (0, getDatesInRange_1.getDateInRange)(date.startDate, date.endDate);
            const allDatesStrings = allDates.map((date) => date.toISOString());
            // finding the roomOccupancy with the given input
            const evenNumberMaker = (number) => {
                if (number % 2 === 1)
                    return number + 1;
                else
                    return number;
            };
            // converting the input number of guests to the nearest room occupancy of room types
            const roomOccupancy = roomDetails.map((item) => evenNumberMaker(item));
            // changing the roomOccupancy in to an object with the number of count of a single number
            const result = new Map();
            for (let i = 0; i < roomOccupancy.length; i++) {
                const element = roomOccupancy[i];
                const count = result.get(element) || 0;
                result.set(element, count + 1);
            }
            // converting the map object to regular object Object.fromEntries(result)
            const roomOccupancyAndCount = Object.fromEntries(result);
            // function for checking the unavailable dates in rooms to check if it is available on given dates
            const isAvailable = (roomNumber) => {
                const isFound = roomNumber.unavailableDates.some((date) => allDatesStrings.includes(new Date(date).toISOString()));
                // returning true if the room is available and false if the room is unavailable
                return !isFound;
            };
            const availableRoomTypes = [];
            for (const item in roomOccupancyAndCount) {
                // putting the index value to a variable
                const availableRoomTypesIndex = Object.keys(roomOccupancyAndCount).indexOf(item);
                // creating an array in the index of the availableRoomTypes array
                availableRoomTypes[availableRoomTypesIndex] = [];
                // fetching the required roomType according to the roomOccupancy and resortId
                const roomType = yield this.roomRepositary.getAll({
                    resortId: resortId.id,
                    maxPeople: item,
                });
                // throwing an error if no room types are available for given roomOccupancy(maximum people)
                if (roomType.length === 0)
                    throw errorResponse_1.default.notFound(`No Room available with occupancy of ${+item - 1} or ${item} people`);
                // looping through single room type
                roomType.forEach((singleRoomType) => {
                    // initializing a flag to check if the rooms are available according to the given input of rooms
                    let flag = 0;
                    // looping the rooms inside room type
                    for (let i = 0; i < singleRoomType.roomNumbers.length; i++) {
                        const roomNumber = singleRoomType.roomNumbers[i];
                        // checking if the room if available, if available incrementing the flag and deleting the room
                        if (isAvailable(roomNumber))
                            flag++;
                        // stoping the loop if all the rooms are available
                        if (flag === roomOccupancyAndCount[item]) {
                            // pushing the singleroomtype into the above decalred array
                            availableRoomTypes[availableRoomTypesIndex].push(singleRoomType);
                            break;
                        }
                    }
                });
                // throwing error if no roomtypes are pushed inside the array since no room is available for the date
                if (availableRoomTypes[availableRoomTypesIndex].length === 0)
                    throw errorResponse_1.default.notFound("No Rooms are available for this dates");
            }
            // throwing an error if the no room types inside the availablr room types array
            // ******* no needed actually because if there is not room type available the above error will be thrown and will never reach this error. this is for extra security
            if (availableRoomTypes.length === 0)
                throw errorResponse_1.default.notFound("NO Rooms available for this dates");
            return availableRoomTypes;
        });
    }
    addDatesToRoom(date, roomTypeId) {
        return __awaiter(this, void 0, void 0, function* () {
            const allDates = (0, getDatesInRange_1.getDateInRange)(date.startDate, date.endDate);
            const allDatesStrings = allDates.map((date) => date.toISOString());
            const isAvailable = (roomNumber) => {
                const isFound = roomNumber.unavailableDates.some((date) => allDatesStrings.includes(new Date(date).toISOString()));
                // returning true if the room is available and false if the room is unavailable
                return !isFound;
            };
            const roomType = yield this.roomRepositary.getOne({ _id: roomTypeId });
            if (!roomType)
                throw errorResponse_1.default.notFound('Room not found');
            for (let i = 0; i < (roomType === null || roomType === void 0 ? void 0 : roomType.roomNumbers.length); i++) {
                if (isAvailable(roomType === null || roomType === void 0 ? void 0 : roomType.roomNumbers[i])) {
                    yield this.roomRepositary.addDatesToRoom(roomType._id, roomType === null || roomType === void 0 ? void 0 : roomType.roomNumbers[i]._id, allDatesStrings);
                    break;
                }
            }
        });
    }
    updateRoomDetails(resortId, roomId, roomDetails) {
        return __awaiter(this, void 0, void 0, function* () {
            //checking if the room type exeeds 50
            const roomTypeCount = yield this.roomRepositary.count();
            // throwing error if room type exeeds 50
            if (roomTypeCount === 50)
                throw errorResponse_1.default.badRequest("Cannot add more than 50 Room Types");
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
            const roomNumbers = [
                ...room.roomNumbers,
            ];
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
