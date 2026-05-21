import {
  Request,
  Response,
  NextFunction
} from "express";

import { AppError }
from "../utils/AppError";

import { ZodError } from "zod";

export const errorHandler = (
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {

  console.error(error);
  if (error instanceof ZodError) {

    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors: error.flatten()
    });

  }
  if (error instanceof AppError) {

    return res.status(
      error.statusCode
    ).json({
      success: false,
      message: error.message
    });

  }

  return res.status(500).json({
    success: false,
    message: "Internal Server Error"
  });

};