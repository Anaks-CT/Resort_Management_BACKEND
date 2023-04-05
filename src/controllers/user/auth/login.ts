import { RequestHandler } from "express";
import AuthService from "../../../services/auth.service";
// import AuthService from "../../../services/user.service/auth.user.service";

const authService = new AuthService();

export const login: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;
  try {
    const { user } = await authService.login("user",email, password);
    res.json({ message: "user found", data: user });
  } catch (error: unknown) {
    return next(error);
  }
};
