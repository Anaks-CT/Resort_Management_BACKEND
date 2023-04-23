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
        const roomNumbers: {number: string, unavailableDates: []}[] = [];
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
        if (roomDetails.length < 1) throw ErrorResponse.badRequest("No Rooms available");
        return roomDetails;
    }

    async getAvailableRooms(resortId: {name: string, id: string}, roomDetails: number[], date: any){
        // finding the roomOccupancy with the given input
        const evenNumberMaker = (number: number) => {
            if(number % 2 === 1) return number + 1
            else return number
        }
        // converting the input number of guests to the nearest room occupancy of room types
        const roomOccupancy = roomDetails.map(item => evenNumberMaker(item))
        // getting all the roomtypes with input roomDetails value
        const getAvailableRooms =  await Promise.all(roomOccupancy.map(item => this.roomRepositary.getAll({resortId: resortId.id, maxPeople: item})))
        // getting all the dates between the start date and end date
        const allDates = getDateInRange(date.startDate, date.endDate)
        // function for checking the unavailable dates in rooms to check if it is available on given dates
        const isAvailable = (roomNumber: any) => {
            const isFound = roomNumber.unavailableDates.some((date: any) =>  allDates.includes(new Date(date)))
            return !isFound
        }
        // declaring an array for all the room types
        const availableRoomTypes:any = []
        // looping the array of available roomtypes with a fixed number of people
        getAvailableRooms.forEach((roomTypeArray: any) =>{
            // looping the array of selected number of peple room type
            roomTypeArray.forEach((roomType: any) => {
                // looping the rooms inside room type
                for (let i = 0; i < roomType.roomNumbers.length; i++) {
                    const item = roomType.roomNumbers[i];
                    // breaking the loop if the first room is availble in the roomtype
                    if (isAvailable(item)) {
                        console.log('came here' + i);
                        availableRoomTypes.push(roomType)
                        break;
                    }
                }
            });
        })
        // throwing error if the rooms aren't availble
        if(!availableRoomTypes) throw ErrorResponse.notFound("My Rooms available in this date")

        return availableRoomTypes
    }

    async updateRoomDetails(
        resortId: string,
        roomId: string,
        roomDetails: any
    ) {
        //checking if the room type exeeds 50
        const roomTypeCount = await this.roomRepositary.count()
        // throwing error if room type exeeds 50
        if(roomTypeCount === 50) throw ErrorResponse.badRequest('Cannot add more than 50 Room Types')
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
        const roomNumbers: {number: string, unavailableDates: Date[]}[] = [...room.roomNumbers];
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
