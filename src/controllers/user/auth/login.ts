import { RequestHandler } from "express";
import AuthService from "../../../services/user.service/auth.user.service";

const authService = new AuthService();

export const login: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const { user } = await authService.login(email, password);
    res.send({ message: "user found", data: user });
  } catch (error: any) {
    return next(error);
  }
};
