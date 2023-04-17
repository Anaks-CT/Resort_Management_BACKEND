import { RequestHandler } from "express";
import AuthService from "../../../services/auth.service";
// import AuthService from "../../../services/user.service/auth.user.service";

const authService = new AuthService();

export const login: RequestHandler = async (req, res, next) => {
  const { email, password } = req.body;
  // console.log(email, password);
  try {
    const { user, token } = await authService.login("user",email, password);
    const {password: hashedPassword, role, ...userDetails} = user._doc
    console.log(token);
    res.json({ message: "user found", data: userDetails, token });
  } catch (error: unknown) {
    return next(error);
  }
};
