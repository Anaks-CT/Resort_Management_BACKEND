import { Request, Response, NextFunction } from "express";
import ErrorResponse from "../../../error/errorResponse";
import AuthService from "../../../services/auth.service";

const authService = new AuthService();

export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, phone, email, password } = req.body;
  try {
    const { user } = await authService.signup(name, phone, email, password);
    res.send({ message: "new user created", data: user });
  } catch (error: any) {
    if (error.code === 11000)
      return next(ErrorResponse.badRequest("User already registered"));
    return next(error);
  }
};
