import { sign, JwtPayload, verify } from "jsonwebtoken";

export const signToken = (_id: string): JwtPayload | string => {
  return sign({ _id }, process.env.JWT_SECRET as string, { expiresIn: "1d" });
};

export const verifyToken = (token: string) => {
  return verify(token, process.env.JWT_SECRET as string);
};
