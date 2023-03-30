import bcrypt from "bcrypt";
import ErrorResponse from "../error/errorResponse";
import { IloginResponse, IsignupResponse } from "../interface/user.interface";
import UserRepository from "../repositories/user.repository";

type role = "user" | "admin" | "manager";
// type loginDetails = {
//     email: string,
//     password: string
// }
export class AuthService {
    constructor(private userRepository = new UserRepository()) {}

    async login(
        role: role,
        email: string,
        password: string
    ): Promise<IloginResponse> {
        let user
        if (role === "user") {
             user = await this.userRepository.finduser(email);
        }else{
            user = null
        }
        
        if (!user) throw ErrorResponse.unauthorized("User not found");
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw ErrorResponse.unauthorized("Invalid Email or Password");
        }
        return { user };
    }

    async signup(name: string, phone: number, email: string, password: string): Promise<IsignupResponse> {
        const checkUserDupe = await this.userRepository.finduser(email)
        if (checkUserDupe) throw ErrorResponse.unauthorized('Email aldready Registered')
        const hashedPassword = await bcrypt.hash(password, 10)
        const userDetails = { name, phone, email, password }
        const user = await this.userRepository.createUser(userDetails);
        return {user}
      }
}


// const token = jwt.sign({ id: user._id }, config.jwtSecret);

export default AuthService;
