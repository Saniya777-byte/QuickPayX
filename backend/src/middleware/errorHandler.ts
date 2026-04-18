import { Request, Response, NextFunction } from "express";
import { AppError } from "../errors/AppError";

export const errorHandler = (
  err: Error | AppError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      message: err.message,
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
  }

  console.error("Unexpected error:", err);
  res.status(500).json({
    message: "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
};
