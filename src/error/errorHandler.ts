import { Request, Response, NextFunction } from "express";
import ErrorResponse from "./errorResponse";

export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
): Response => {
  console.error(err);

  if (err instanceof ErrorResponse) {
    return res.status(err.status).json({ message: err.message });
  }
   return res.status(500).json({ message: "Internal server error" });
};
