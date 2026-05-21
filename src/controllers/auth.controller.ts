import { Response } from "express";

import prisma from "../config/db";

import {
  loginUser,
  registerUser
} from "../services/auth.service";

import {
  loginSchema,
  registerSchema
} from "../utils/validators";

import { asyncHandler }
from "../utils/asyncHandler";

import { AuthRequest }
from "../middleware/auth.middleware";

export const register =
asyncHandler(
  async (
    req: AuthRequest,
    res: Response
  ) => {

    const validatedData =
      registerSchema.parse(req.body);

    const user =
      await registerUser(
        validatedData.email,
        validatedData.password
      );

    res.status(201).json({
      success: true,
      data: user
    });

  }
);

export const login =
asyncHandler(
  async (
    req: AuthRequest,
    res: Response
  ) => {

    const validatedData =
      loginSchema.parse(req.body);

    const token =
      await loginUser(
        validatedData.email,
        validatedData.password
      );

    res.json({
      success: true,
      data: token
    });

  }
);

export const getCurrentUser =
asyncHandler(
  async (
    req: AuthRequest,
    res: Response
  ) => {

    const user =
      await prisma.user.findUnique({
        where: {
          id: req.userId
        },
        select: {
          id: true,
          email: true,
          createdAt: true
        }
      });

    res.json({
      success: true,
      data: user
    });

  }
);