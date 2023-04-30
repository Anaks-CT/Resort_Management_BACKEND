import AuthService from "../../../services/auth.service";
import expressAsyncHandler from "express-async-handler";

const authService = new AuthService();

export const login = expressAsyncHandler(async (req, res) => {
  const { email, password } = req.body;
    const { user, token } = await authService.login("user",email, password);
    const {password: hashedPassword, role, ...userDetails} = user._doc
    console.log(token);
    res.json({ message: "user found", data: userDetails, token });
});
