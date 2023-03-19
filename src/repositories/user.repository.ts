import ErrorResponse from "../error/errorResponse";
import { IUser } from "../interface/user.interface";
import UserSchema from "../models/user.model";

class UserRepository {
  async createUser(
    name: string,
    phone: number,
    email: string,
    password: string
  ): Promise<IUser> {
    try {
      const user = new UserSchema({ name, phone, email, password }); // doubt is the try catch needed in repositary or is it only when necessary
      await user.save();
      return user.toJSON() as IUser;
    } catch (error) {
      throw ErrorResponse.internalError("database is down")      
    }
  }

  async finduser(email: string): Promise<IUser | null> {
    const user = await UserSchema.findOne({ email: email });
    return user ? user.toJSON() as IUser : null;
  }
}

export default UserRepository;
