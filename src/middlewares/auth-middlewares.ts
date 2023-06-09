import expressAsyncHandler from "express-async-handler";
import jwt from "jsonwebtoken";
import ErrorResponse from "../error/errorResponse";
import validator from "validator";
import { Request } from "express";
import UserService from "../services/user.service";
import ManagerService from "../services/manager.service";
const userService = new UserService();
const managerService = new ManagerService();
export interface RequestWithUser extends Request {
    user?: any;
}

export const authMiddleware = expressAsyncHandler(
    async (req: RequestWithUser, res, next) => {
        try {
            if (!req.headers?.authorization)
                throw ErrorResponse.unauthorized("Access Denied");
            const token = req.headers.authorization.replace("Bearer ", "");
            if (!token) {
                throw ErrorResponse.unauthorized(
                    "Authorization Failed !! Please Login"
                );
            }
            const secret = process.env.JWT_SECRET;
            if (!secret)
                throw ErrorResponse.unauthorized("JWT Secret not found");
            jwt.verify(token, secret, (err, user) => {
                if (err || !user || typeof user === "string" || !user?._id) {
                    next(
                        ErrorResponse.unauthorized(
                            "Authorization Failed !! Please Login"
                        )
                    );
                }
                req.user = user;
                next();
            });
        } catch (err: any) {
            next(ErrorResponse.unauthorized(err.message));
        }
    }
);

export const managerVerify = expressAsyncHandler(
    async (req: RequestWithUser, res, next) => {
        try {
            authMiddleware(req, res, (err) => {
                if (err) return next(err);
                if (!req.user._id)
                    return next(
                        ErrorResponse.unauthorized("You are not Authenticated")
                    );
                if (!validator.isMongoId(req.user._id))
                    return next(
                        ErrorResponse.unauthorized("You are not Authorized")
                    );

                managerService
                    .getManagerById(req.user._id)
                    .then((res) => (req.user = res))
                    .catch((err) => next(err));
                if (!req.user)
                    return next(
                        ErrorResponse.unauthorized("You are not authorized")
                    );

                return next();
            });
        } catch (err: any) {
            next(err);
        }
    }
);
export const userVerify = expressAsyncHandler(
    async (req: RequestWithUser, res, next) => {
        try {
            authMiddleware(req, res, (err) => {
                if (err) return next(err);
                if (!req.user._id)
                    return next(
                        ErrorResponse.unauthorized("You are not Authenticated")
                    );
                if (!validator.isMongoId(req.user._id))
                    return next(
                        ErrorResponse.unauthorized("You are not Authorized")
                    );

                userService
                    .getSingleUserDetails(req.user._id)
                    .then((res) => {
                        if (!req.user)
                            return next(
                                ErrorResponse.unauthorized(
                                    "You are not authorized"
                                )
                            );
                        req.user = res;
                        return next();
                    })
                    .catch((err) => next(err));
            });
        } catch (err: any) {
            next(err);
        }
    }
);

export const adminVerify = expressAsyncHandler(
    async (req: RequestWithUser, res, next) => {
        authMiddleware(req, res, (err) => {
            try {
                if (err) return next(err);
                if (!req.user)
                    return next(
                        ErrorResponse.unauthorized("You are not Authenticated")
                    );
                if (req.user._id === process.env.password) {
                    next();
                } else {
                    return next(
                        ErrorResponse.unauthorized("You are not authorized")
                    );
                }
            } catch (error) {
                next(error);
            }
        });
    }
);

export const adminOrMangerVerify = expressAsyncHandler(
    async (req: RequestWithUser, res, next) => {
        authMiddleware(req, res, async (err) => {
            try {
                if (err) return next(err);
                if (!req.user)
                    return next(
                        ErrorResponse.unauthorized("You are not Authenticated")
                    );
                let manager;
                if (validator.isMongoId(req.user._id)) {
                    const managerDetails = await managerService.getManagerById(
                        req.user._id
                    );
                    manager = managerDetails;
                    if (!managerDetails)
                        return next(
                            ErrorResponse.unauthorized(
                                "You are not Authenticated"
                            )
                        );
                }
                if (!manager && req.user._id !== process.env.password)
                    return next(
                        ErrorResponse.unauthorized("You are not Authenticated")
                    );
                next();
            } catch (error) {
                next(error);
            }
        });
    }
);

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
