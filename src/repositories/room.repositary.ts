import { BaseRepository } from "./baseRepositary";
import { ObjectId } from "mongodb";
import roomModel from "../models/room.model";


class RoomRespositary extends BaseRepository {
    constructor() {
        super(roomModel);
    }
    async getCountOfRoomByResortId(resortId: string): Promise<number> {
        return await roomModel.find({resortId: resortId}).count()
    }
   
    async getRoomByResortIdRoomId(resortId: string, roomId: string){
        return await roomModel.findOne({resortId: new ObjectId(resortId), _id: new ObjectId(roomId)})
    }

    async updateRoomDetailById(roomId: string, roomDetail: any, roomNumber: any){
        return await roomModel.updateOne({_id: roomId},{$set: {...roomDetail, roomNumbers: roomNumber}},)
    }
}

export default RoomRespositary;
