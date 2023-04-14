import asyncHandler from "express-async-handler";
import ErrorResponse from "../error/errorResponse";
import {
    addResort,
    addRoomSchema,
    faqSchema,
    loginSchema,
    signupSchema,
} from "./yupSchema";
import validator from "validator";

// Validating req.body before reaching controller

// signup body validation
export const validateSignup = asyncHandler(async (req, res, next) => {
    req.body = await signupSchema.validate(req.body);
    next();
});

// login body validation
export const validateLogin = asyncHandler(async (req, res, next) => {
    req.body = await loginSchema.validate(req.body);
    next();
});

// add resort body validation
export const resortValidate = asyncHandler(async (req, res, next) => {
    req.body = await addResort.validate(req.body);
    next();
});

export const faqValidate = asyncHandler(async (req, res, next) => {
    req.body = await faqSchema.validate(req.body);
    next();
});

export const roomValidate = asyncHandler(async (req, res, next) => {
    req.body.roomData = await addRoomSchema.validate(req.body.roomData);
    next();
});

export const managerSignupValidate = asyncHandler(async (req, res, next) => {
    if (!req.body.resortId || !validator.isMongoId(req.body.resortId)) {
        throw ErrorResponse.badRequest("Cannot find Resort");
    }
    req.body = await signupSchema.validate(req.body);
    next();
});

export const paramsIdValidate = asyncHandler( async (req, res, next) => {
    if(!req.params.id || !validator.isMongoId(req.params.id))
        throw ErrorResponse.badRequest('Cannot find Resort')
    next()
})

// export const managerValidate = asyncHandler(
//     async (req, res, next) => {

//     }
// )
