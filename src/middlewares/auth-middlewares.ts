import expressAsyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';
import ErrorResponse from '../error/errorResponse';

import { Request } from 'express';
import UserService from '../services/user.service';
const userService = new UserService();

interface RequestWithUser extends Request {
  user?: any;
}
export const authMiddleware = expressAsyncHandler(async (req: RequestWithUser, res, next) => {
  try {
    
    if (!req.headers?.authorization)
      throw ErrorResponse.unauthorized("Access Denied");
    const token = req.headers.authorization.replace("Bearer ", "");
    console.log(token);
    const secret = process.env.JWT_SECRET;
    if (!secret) throw ErrorResponse.unauthorized('JWT Secret not found');
    jwt.verify(token, secret, (err, user) => {
      // console.log(user);
      if(err || !user || typeof user === 'string' || !user?._id ) next( ErrorResponse.unauthorized('Authorization Failed !! Please Login'));
      req.user = user
      next();
    })
  } catch (err: any) {
    throw ErrorResponse.unauthorized(err.message);
  }
});

export const userVerify = expressAsyncHandler(async(req: RequestWithUser, res, next) => {
  try { 
    
    authMiddleware(req, res, () => {
      if(!req.user) next(ErrorResponse.unauthorized('You are not Authenticated'))
      const user = userService.getSingleUserDetails(req.user._id)
      if(!user) next( ErrorResponse.unauthorized('You are not authorized'))
      next()

    })
  } catch (err: any) {
    next(err)
  }
})

export const adminVerify = expressAsyncHandler(async(req: RequestWithUser, res, next) => {
  authMiddleware(req, res, () => {
    try {
      if(!req.user) next(ErrorResponse.unauthorized('You are not Authenticated'))
      if(req.user._id === process.env.password){
        next()
      }else{
        return next( ErrorResponse.unauthorized('You are not authorized'))
      }
    } catch (error) {
      next(error)
    }
  })
})




// export const userAuthorization = async (req: Request, res: Response, next: NextFunction) => {
//     const token = req.headers?.authorization?.split(" ")[1];
//     // if (!token) return next(ErrorResponse.unauthorized("Unauthorized"));
  
//     // verify token
//     let decode;
//     try {
//       decode = await jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
//     } catch (err) {
//       return next(ErrorResponse.forbidden("Forbidden"));
//     }
  
//     if (!decode.data.email || !decode.data.id)
//       return next(ErrorResponse.forbidden("Forbidden"));
  
//     req.userData = decode.data;
//     return next();
//   };
  