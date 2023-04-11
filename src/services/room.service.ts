import ErrorResponse from "../error/errorResponse";
import RoomRespositary from "../repositories/room.repositary";
import { IRoom } from "../interface/room.interface";
import { ObjectId } from "mongodb";
import ResortRepositary from "../repositories/resort.repositary";
import { numberToAlphabet } from "../utils/numberToAlphabet";

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
        if (!roomDetails)
            throw ErrorResponse.badRequest("Room Details cannot be empty");
        if (roomByResortId?.name === roomDetails.name)
            throw ErrorResponse.badRequest("Room type already exists");
        const roomTypeCount =
            await this.roomRepositary.getCountOfRoomByResortId(resortId);
        const { noOfRooms } = roomDetails;
        console.log(noOfRooms);
        const roomNumbers: any[] = [];
        for (let i = 0; i < noOfRooms; i++) {
            roomNumbers.push({
                number: 100 + i + 1 + numberToAlphabet(roomTypeCount + 1),
                unavailableDates: [],
            });
        }
        console.log(roomNumbers);
        const newRoom = {
            ...roomDetails,
            roomNumbers: roomNumbers,
            resortId: new ObjectId(resortId),
        };
        const room = await this.roomRepositary.create<IRoom>(newRoom);
        if (!room) throw ErrorResponse.badRequest("Room not created");
        const editResortResponse =
            await this.resortRepositary.addingRoomInResort(room._id!, resortId);
        if (editResortResponse.modifiedCount !== 1)
            throw ErrorResponse.internalError("Room not added to Resort");
        return room;
    }

    async getRoomsByResortId(resortId: string): Promise<IRoom[] | null> {
        const roomDetails = await this.roomRepositary.getAll<IRoom>({
            resortId: new ObjectId(resortId),
        });
        if (!roomDetails) throw ErrorResponse.badRequest("No Rooms available");
        return roomDetails;
    }

    async updateRoomDetails(
        resortId: string,
        roomId: string,
        roomDetails: any
    ) {
        console.log(resortId);
        console.log(roomId);
        // console.log(roomDetails.noOfRooms);
        // checking if the room exist in resort
        const room = await this.roomRepositary.getRoomByResortIdRoomId(
            resortId,
            roomId
        );
        if (!room)
            throw ErrorResponse.badRequest("Room or Resort doesn't exist");
        const roomLength = room?.roomNumbers.length;
        // throwing an error if room numbers exeeds 999
        // throwing an error if roomDetails.noOfRoom less than previous number
        if (roomLength > roomDetails.noOfRooms)
            throw ErrorResponse.badRequest(
                `Rooms should be more than ${roomLength}`
            );

        // console.log(roomLength);
        const lastRoomNumber = room?.roomNumbers[roomLength! - 1];
        // console.log(lastRoomNumber)
        const roomNumbers: any[] = [...room.roomNumbers];
        const roomNumberAlphabet = room.roomNumbers[0].number.substring(
            3,
            room.roomNumbers[0].number.length
        );
        for (let i = 0; i < roomDetails.noOfRooms - roomLength; i++) {
            roomNumbers.push({
                number: 100 + i + 1 + roomLength + roomNumberAlphabet,
                unavailableDates: [],
            });
        }

        if (roomDetails.images.length < 1) {
            delete roomDetails.images;
        }
        // console.log(roomDetails);
        console.log(roomNumbers);
        // const pushRooms = {}
        const editRoom = await this.roomRepositary.updateRoomDetailById(
            roomId,
            roomDetails,
            roomNumbers
        );
        console.log(editRoom);
        // const updateRoom = await this.roomRepositary.update({})
        return editRoom;
    }
}
