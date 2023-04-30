import ErrorResponse from "../error/errorResponse";
import RoomRespositary from "../repositories/room.repositary";
import { IRoom } from "../interface/room.interface";
import { ObjectId } from "mongodb";
import ResortRepositary from "../repositories/resort.repositary";
import { numberToAlphabet } from "../utils/numberToAlphabet";
import { getDateInRange } from "../utils/getDatesInRange";

export default class RoomService {
    constructor(
        private roomRepositary = new RoomRespositary(),
        private resortRepositary = new ResortRepositary()
    ) {}

    async createRoom(roomDetails: any, resortId: string) {
        // search for duplication of room with name
        const roomByResortId = await this.roomRepositary.getOne<IRoom>({
            resortId: resortId,
            name: roomDetails.name,
        });
        // throwing error if the room details not found with the resort Id and room Id
        if (!roomDetails)
            throw ErrorResponse.badRequest("Room Details cannot be empty");
        // throwing error if the room name is already present
        if (roomByResortId?.name === roomDetails.name)
            throw ErrorResponse.badRequest("Room type already exists");
        // count of present room type to give the alphabet for the next room type in room numbers
        const roomTypeCount =
            await this.roomRepositary.getCountOfRoomByResortId(resortId);
        const { noOfRooms } = roomDetails;
        // pushing all the room numbers generated using the util function and passing to repositary
        const roomNumbers: { number: string; unavailableDates: [] }[] = [];
        for (let i = 0; i < noOfRooms; i++) {
            roomNumbers.push({
                number: 100 + i + 1 + numberToAlphabet(roomTypeCount + 1),
                unavailableDates: [],
            });
        }
        // initializing the new room with all details and passing to reposiaary
        const newRoom = {
            ...roomDetails,
            roomNumbers: roomNumbers,
            resortId: new ObjectId(resortId),
        };
        const room = await this.roomRepositary.create<IRoom>(newRoom);
        // throwing error if the reposiatry doesnt return the newly created room
        if (!room) throw ErrorResponse.badRequest("Room not created");
        // adding the newly created room to the corresponding resortiD
        const editResortResponse =
            await this.resortRepositary.addingRoomInResort(room._id!, resortId);
        // throwing error if resort isn't updated
        if (editResortResponse.modifiedCount !== 1)
            throw ErrorResponse.internalError("Room not added to Resort");
        return room;
    }

    async getRoomsByResortId(resortId: string): Promise<IRoom[] | null> {
        const roomDetails = await this.roomRepositary.getAll<IRoom>({
            resortId: new ObjectId(resortId),
        });
        if (roomDetails.length < 1)
            throw ErrorResponse.badRequest("No Rooms available");
        return roomDetails;
    }

    async getAvailableRooms(
        resortId: { name: string; id: string },
        roomDetails: number[],
        date: any
    ) {
        // getting all the dates between the start date and end date and including them
        const allDates = getDateInRange(date.startDate, date.endDate);
        const allDatesStrings = allDates.map((date) => date.toISOString());
        // finding the roomOccupancy with the given input
        const evenNumberMaker = (number: number) => {
            if (number % 2 === 1) return number + 1;
            else return number;
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
        const isAvailable = (roomNumber: any) => {
            const isFound = roomNumber.unavailableDates.some((date: any) =>
                allDatesStrings.includes(new Date(date).toISOString())
            );
            // returning true if the room is available and false if the room is unavailable
            return !isFound;
        };
        const availableRoomTypes: any = [];
        for (const item in roomOccupancyAndCount) {
            // putting the index value to a variable
            const availableRoomTypesIndex = Object.keys(
                roomOccupancyAndCount
            ).indexOf(item);
            // creating an array in the index of the availableRoomTypes array
            availableRoomTypes[availableRoomTypesIndex] = [];
            // fetching the required roomType according to the roomOccupancy and resortId
            const roomType = await this.roomRepositary.getAll<IRoom>({
                resortId: resortId.id,
                maxPeople: item,
            });
            // throwing an error if no room types are available for given roomOccupancy(maximum people)
            if (roomType.length === 0)
                throw ErrorResponse.notFound(
                    `No Room available with occupancy of ${
                        +item - 1
                    } or ${item} people`
                );
            // looping through single room type
            roomType.forEach((singleRoomType) => {
                // initializing a flag to check if the rooms are available according to the given input of rooms
                let flag = 0;
                // looping the rooms inside room type
                for (let i = 0; i < singleRoomType.roomNumbers.length; i++) {
                    const roomNumber = singleRoomType.roomNumbers[i];
                    // checking if the room if available, if available incrementing the flag and deleting the room
                    if (isAvailable(roomNumber)) flag++;
                    // stoping the loop if all the rooms are available
                    if (flag === roomOccupancyAndCount[item]) {
                        // pushing the singleroomtype into the above decalred array
                        availableRoomTypes[availableRoomTypesIndex].push(
                            singleRoomType
                        );
                        break;
                    }
                }
            });
            // throwing error if no roomtypes are pushed inside the array since no room is available for the date
            if (availableRoomTypes[availableRoomTypesIndex].length === 0)
                throw ErrorResponse.notFound(
                    "No Rooms are available for this dates"
                );
        }

        // throwing an error if the no room types inside the availablr room types array
        // ******* no needed actually because if there is not room type available the above error will be thrown and will never reach this error. this is for extra security
        if (availableRoomTypes.length === 0)
            throw ErrorResponse.notFound("NO Rooms available for this dates");
        return availableRoomTypes;
    }

    async addDatesToRoom(date: any, roomTypeId: any) {
        const allDates = getDateInRange(date.startDate, date.endDate);
        const allDatesStrings = allDates.map((date) => date.toISOString());
        const isAvailable = (roomNumber: any) => {
            const isFound = roomNumber.unavailableDates.some((date: any) =>
                allDatesStrings.includes(new Date(date).toISOString())
            );
            // returning true if the room is available and false if the room is unavailable
            return !isFound;
        };

        const roomType = await this.roomRepositary.getOne<IRoom>({
            _id: roomTypeId,
        });
        let roomNumberId
        if (!roomType) throw ErrorResponse.notFound("Room not found");
        for (let i = 0; i < roomType?.roomNumbers.length; i++) {
            if (isAvailable(roomType?.roomNumbers[i])) {
                roomNumberId = roomType?.roomNumbers[i]._id
                await this.roomRepositary.addDatesToRoom(
                    roomType._id,
                    roomType?.roomNumbers[i]._id,
                    allDatesStrings
                );
                break;
            }
        }
        return roomNumberId
    }

    async removeDatesFromRoom(roomTypeId: string, roomId: string, date: any){
        const allDates = getDateInRange(date.startDate, date.endDate);
        const allDatesStrings = allDates.map((date) => date.toISOString());
        await this.roomRepositary.removeDatesFromRoom(roomTypeId, roomId, allDatesStrings)
    }

    async updateRoomDetails(
        resortId: string,
        roomId: string,
        roomDetails: any
    ) {
        //checking if the room type exeeds 50
        const roomTypeCount = await this.roomRepositary.count();
        // throwing error if room type exeeds 50
        if (roomTypeCount === 50)
            throw ErrorResponse.badRequest(
                "Cannot add more than 50 Room Types"
            );
        // checking if the room exist in resort
        const room = await this.roomRepositary.getRoomByResortIdRoomId(
            resortId,
            roomId
        );
        // throwing erro if room id or resortid given is wrong
        if (!room)
            throw ErrorResponse.badRequest("Room or Resort doesn't exist");

        const roomLength = room?.roomNumbers.length;
        // throwing an error if roomDetails.noOfRoom less than previous number
        if (roomLength > roomDetails.noOfRooms)
            throw ErrorResponse.badRequest(
                `Rooms should be more than ${roomLength}`
            );

        // initializing an array with all the existing room numbers to not lose the id
        const roomNumbers: { number: string; unavailableDates: Date[] }[] = [
            ...room.roomNumbers,
        ];
        // finding the room number alphabet after 3 digits (101b) for example
        const roomNumberAlphabet = room.roomNumbers[0].number.substring(
            3,
            room.roomNumbers[0].number.length
        );
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
        const editRoom = await this.roomRepositary.updateRoomDetailById(
            roomId,
            roomDetails,
            roomNumbers
        );
        return editRoom;
    }


}
