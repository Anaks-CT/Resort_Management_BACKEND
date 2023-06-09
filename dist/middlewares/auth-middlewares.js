"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminOrMangerVerify = exports.adminVerify = exports.userVerify = exports.managerVerify = exports.authMiddleware = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const errorResponse_1 = __importDefault(require("../error/errorResponse"));
const validator_1 = __importDefault(require("validator"));
const user_service_1 = __importDefault(require("../services/user.service"));
const manager_service_1 = __importDefault(require("../services/manager.service"));
const userService = new user_service_1.default();
const managerService = new manager_service_1.default();
exports.authMiddleware = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (!((_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization))
            throw errorResponse_1.default.unauthorized("Access Denied");
        const token = req.headers.authorization.replace("Bearer ", "");
        if (!token) {
            throw errorResponse_1.default.unauthorized("Authorization Failed !! Please Login");
        }
        const secret = process.env.JWT_SECRET;
        if (!secret)
            throw errorResponse_1.default.unauthorized("JWT Secret not found");
        jsonwebtoken_1.default.verify(token, secret, (err, user) => {
            if (err || !user || typeof user === "string" || !(user === null || user === void 0 ? void 0 : user._id)) {
                next(errorResponse_1.default.unauthorized("Authorization Failed !! Please Login"));
            }
            req.user = user;
            next();
        });
    }
    catch (err) {
        next(errorResponse_1.default.unauthorized(err.message));
    }
}));
exports.managerVerify = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, exports.authMiddleware)(req, res, (err) => {
            if (err)
                return next(err);
            if (!req.user._id)
                return next(errorResponse_1.default.unauthorized("You are not Authenticated"));
            if (!validator_1.default.isMongoId(req.user._id))
                return next(errorResponse_1.default.unauthorized("You are not Authorized"));
            managerService
                .getManagerById(req.user._id)
                .then((res) => (req.user = res))
                .catch((err) => next(err));
            if (!req.user)
                return next(errorResponse_1.default.unauthorized("You are not authorized"));
            return next();
        });
    }
    catch (err) {
        next(err);
    }
}));
exports.userVerify = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        (0, exports.authMiddleware)(req, res, (err) => {
            if (err)
                return next(err);
            if (!req.user._id)
                return next(errorResponse_1.default.unauthorized("You are not Authenticated"));
            if (!validator_1.default.isMongoId(req.user._id))
                return next(errorResponse_1.default.unauthorized("You are not Authorized"));
            userService
                .getSingleUserDetails(req.user._id)
                .then((res) => {
                if (!req.user)
                    return next(errorResponse_1.default.unauthorized("You are not authorized"));
                req.user = res;
                return next();
            })
                .catch((err) => next(err));
        });
    }
    catch (err) {
        next(err);
    }
}));
exports.adminVerify = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, exports.authMiddleware)(req, res, (err) => {
        try {
            if (err)
                return next(err);
            if (!req.user)
                return next(errorResponse_1.default.unauthorized("You are not Authenticated"));
            if (req.user._id === process.env.password) {
                next();
            }
            else {
                return next(errorResponse_1.default.unauthorized("You are not authorized"));
            }
        }
        catch (error) {
            next(error);
        }
    });
}));
exports.adminOrMangerVerify = (0, express_async_handler_1.default)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    (0, exports.authMiddleware)(req, res, (err) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (err)
                return next(err);
            if (!req.user)
                return next(errorResponse_1.default.unauthorized("You are not Authenticated"));
            let manager;
            if (validator_1.default.isMongoId(req.user._id)) {
                const managerDetails = yield managerService.getManagerById(req.user._id);
                manager = managerDetails;
                if (!managerDetails)
                    return next(errorResponse_1.default.unauthorized("You are not Authenticated"));
            }
            if (!manager && req.user._id !== process.env.password)
                return next(errorResponse_1.default.unauthorized("You are not Authenticated"));
            next();
        }
        catch (error) {
            next(error);
        }
    }));
}));
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
