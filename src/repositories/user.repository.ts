import ErrorResponse from "../error/errorResponse";
import { IUser } from "../interface/user.interface";
import userModel from "../models/user.model";
import { BaseRepository } from "./baseRepositary";

class UserRepository extends BaseRepository{
  constructor(){
    super(userModel)
  }

  async changePassword(
    email: string,
    password: string,
) {
    return await userModel.updateOne({email: email},{
      $set: {password: password}
    })
}

}

export default UserRepository;
