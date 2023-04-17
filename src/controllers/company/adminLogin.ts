import { RequestHandler } from "express";
import ErrorResponse from "../../error/errorResponse";
import { signToken } from "../../utils/jwtTokenManage";


export const adminLogin: RequestHandler = async (req, res, next) => {
    try {
        const {email, password} = req.body
        if(!email) throw ErrorResponse.forbidden('Admin must have an email to login')

        if(email !== process.env.email) throw ErrorResponse.unauthorized('Admin not found')
        if(password !== process.env.password) throw ErrorResponse.unauthorized('Invalid Password')
        
        res.json({ message: "Admin login successfull", token: signToken(process.env.password!)});
    } catch (error: unknown) {
        return next(error)
    }
};