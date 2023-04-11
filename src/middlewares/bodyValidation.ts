import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import ErrorResponse from "../error/errorResponse";
import { addResort, addRoomSchema, faqSchema, loginSchema, signupSchema } from "./yupSchema";

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
export const validateLogin: RequestHandler = asyncHandler(
    async (req, res, next) => {
        try {
            req.body = await loginSchema.validate(req.body);
            next();
        } catch (err: any) {
            throw ErrorResponse.unauthorized(err.errors[0]);
        }
    }
);

// add resort body validation
export const resortValidate: RequestHandler = asyncHandler(
    async (req, res, next) => {
        try {
            req.body = await addResort.validate(req.body);
            next();
        } catch (err: any) {
            throw ErrorResponse.unauthorized(err.errors[0]);
        }
    }
);

export const faqValidate: RequestHandler = asyncHandler(
    async (req, res, next) => {
        try {
            req.body = await faqSchema.validate(req.body);
            next();
        } catch (err: any) {
            throw ErrorResponse.unauthorized(err.errors[0]);
        }
    }
);

export const roomValidate: RequestHandler = asyncHandler(
    async (req, res, next) => {
        console.log(req.body);
        try {
            req.body.roomData = await addRoomSchema.validate(req.body.roomData)
            next()
        } catch (err: any) {
            throw ErrorResponse.unauthorized(err.errors[0])
        }
    }
)