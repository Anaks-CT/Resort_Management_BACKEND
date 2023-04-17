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
import { RequestHandler } from "express";

// Validating req.body before reaching controller

// signup body validation
export const validateSignup: RequestHandler = asyncHandler(
    async (req, res, next) => {
        try {
            req.body = await signupSchema.validate(req.body);
            next();
        } catch (err: any) {
            throw ErrorResponse.unauthorized(err.errors[0]);
        }
    }
);


// login body validation
export const validateLogin = asyncHandler(async (req, res, next) => {
    try {
        req.body = await loginSchema.validate(req.body);
        next();
    } catch (err: any) {
        throw ErrorResponse.unauthorized(err.errors[0]);
    }
});

// add resort body validation
export const resortValidate = asyncHandler(async (req, res, next) => {
    try {
        req.body = await addResort.validate(req.body);
        next();
    } catch (err: any) {
        throw ErrorResponse.unauthorized(err.errors[0]);
    }
});

export const faqValidate = asyncHandler(async (req, res, next) => {
    try {
        req.body = await faqSchema.validate(req.body);
        next();
    } catch (err: any) {
        throw ErrorResponse.unauthorized(err.errors[0]);
    }
});

export const roomValidate = asyncHandler(async (req, res, next) => {
    try {
        req.body.roomData = await addRoomSchema.validate(req.body.roomData);
        next();
    } catch (err: any) {
        throw ErrorResponse.unauthorized(err.errors[0]);
    }
});

export const managerSignupValidate = asyncHandler(async (req, res, next) => {
    try {
        if (!req.body.resortId || !validator.isMongoId(req.body.resortId)) {
            throw ErrorResponse.badRequest("Cannot find Resort");
        }
        req.body = await signupSchema.validate(req.body);
        next();
    } catch (err: any) {
        throw ErrorResponse.unauthorized(err.errors[0]);
    }
});

export const paramsIdValidate = asyncHandler( async (req, res, next) => {
    try {
        if(!req.params.id || !validator.isMongoId(req.params.id))
            throw ErrorResponse.badRequest('Cannot find Resort')
        next()
    } catch (err: any) {
        throw ErrorResponse.unauthorized(err.errors[0]);
    }
})

// export const managerValidate = asyncHandler(
//     async (req, res, next) => {

//     }
// )
