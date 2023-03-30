import ErrorResponse from "../error/errorResponse";
import { IUser } from "../interface/user.interface";
import UserSchema from "../models/user.model";
import { BaseRepository } from "./baseRepositary";

class UserRepository extends BaseRepository{
  constructor(){
    super(UserSchema)
  }
  async createUser(userDetails: any): Promise<IUser> {
      return this.create<IUser>(userDetails);
  }

  async finduser(email: string): Promise<IUser | null> {
    return await this.getByEmail<IUser>(email);
  }
}

export default UserRepository;
