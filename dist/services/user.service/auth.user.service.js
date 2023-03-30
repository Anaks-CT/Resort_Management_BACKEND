"use strict";
// import bcrypt from "bcrypt";
// import ErrorResponse from "../../error/errorResponse";
// import { IloginResponse, IsignupResponse } from "../../interface/user.interface";
// import UserRepository from "../../repositories/user.repository";
// class AuthService {
//   constructor(private userRepository = new UserRepository()) {}
//   async signup(name: string, phone: number, email: string, password: string): Promise<IsignupResponse> {
//     const checkUserDupe = await this.userRepository.finduser(email)
//     if (checkUserDupe) throw ErrorResponse.unauthorized('Email aldready Registered')
//     const hashedPassword = await bcrypt.hash(password, 10);
//     const user = await this.userRepository.createUser(name, phone, email, hashedPassword);
//     return {user};
//   }
//   async login(email: string, password: string): Promise<IloginResponse>{
//     const user = await this.userRepository.finduser(email)
//     if(!user) throw ErrorResponse.unauthorized('User not found')
//     const isPasswordMatch = await bcrypt.compare(password, user.password)
//     if(!isPasswordMatch){
//       throw ErrorResponse.unauthorized('Invalid Email or Password')
//     }
//     return {user}
//     }
//   }
//   // const token = jwt.sign({ id: user._id }, config.jwtSecret);
// export default AuthService;
