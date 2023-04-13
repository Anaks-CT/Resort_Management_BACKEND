import ErrorResponse from "../error/errorResponse";
import { IUser } from "../interface/user.interface";
import UserSchema from "../models/user.model";
import { BaseRepository } from "./baseRepositary";

class UserRepository extends BaseRepository{
  constructor(){
    super(UserSchema)
  }

  
}

export default UserRepository;
