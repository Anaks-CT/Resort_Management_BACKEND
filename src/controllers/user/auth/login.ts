import AuthService from "../../../services/auth.service";
import expressAsyncHandler from "express-async-handler";

const authService = new AuthService();

export const login = expressAsyncHandler(async (req, res) => {
    const { email, password } = req.body;
    const {
        user: {
            _doc: { password: hashedPassword, role, ...userDetails },
        },
        token,
    } = await authService.login("user", email, password);
    res.json({ message: "user found", data: userDetails, token });
});
