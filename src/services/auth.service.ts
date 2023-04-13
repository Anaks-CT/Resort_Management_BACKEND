import bcrypt from "bcrypt";
import ErrorResponse from "../error/errorResponse";
import { IUser, IloginResponse, IsignupResponse } from "../interface/user.interface";
import UserRepository from "../repositories/user.repository";
import MangerRepositary from "../repositories/manager.repositary";
import { IManager } from "../interface/manager.interface";

type role = "user" | "admin" | "manager";
// type loginDetails = {
//     email: string,
//     password: string
// }

interface signUpCred{
    email: string
    password: string
}
export class AuthService {
    constructor(private userRepository = new UserRepository() , private managerRepositary = new MangerRepositary()) {}

    async login(
        role: role,
        email: string,
        password: string
    ): Promise<IloginResponse> {
        let repositary
        if (role === "user") {
            repositary = this.userRepository
        }else if(role === "manager"){
            repositary = this.managerRepositary
        }else{
            repositary = null
        }
        if(!repositary) throw ErrorResponse.badRequest('Please provide role')
        const user = await repositary.getByEmail<IUser>(email);
        if (!user) throw ErrorResponse.unauthorized("User not found");
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            throw ErrorResponse.unauthorized("Invalid Email or Password");
        }
        return { user };
    }

    async signup<T extends signUpCred>(role: role, signupDetails: T): Promise<T> {
        let repositary
        if (role === "user") {
            repositary = this.userRepository
        }else if(role === "manager"){
            repositary = this.managerRepositary
        }else{
            repositary = null
        }
        console.log(signupDetails);
        // if(role === "manager"){

        //     if()
        // }
        if(!repositary) throw ErrorResponse.badRequest('Please provide role')
        const checkUserDupe = await repositary.getByEmail<T>(signupDetails.email)
        if (checkUserDupe) throw ErrorResponse.unauthorized('Email aldready Registered')
        const hashedPassword = await bcrypt.hash(signupDetails.password, 10)
        const userDetails = { ...signupDetails, password: hashedPassword }
        const user = await repositary.create(userDetails);
        if(!user) throw ErrorResponse.internalError(`${role} not Registered`)
        return user 
      }
}


// const token = jwt.sign({ id: user._id }, config.jwtSecret);

export default AuthService;
