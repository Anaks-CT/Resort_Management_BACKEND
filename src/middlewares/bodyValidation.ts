import { RequestHandler } from "express";
import asyncHandler from "express-async-handler";
import ErrorResponse from "../error/errorResponse";
import {loginSchema, signupSchema } from "./yupSchema";

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
