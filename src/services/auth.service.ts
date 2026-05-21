import prisma from "../config/db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { AppError }
from "../utils/AppError";

export const registerUser = async (
  email: string,
  password: string
) => {

  const existingUser = await prisma.user.findUnique({
    where: { email }
  });

  if (existingUser) {
    throw new AppError(
     "User already exists",
      409
   );
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword
    }
  });

  return user;
};

export const loginUser = async (
  email: string,
  password: string
) => {

  const user = await prisma.user.findUnique({
    where: { email }
  });

  if (!user) {
    throw new AppError(
     "Invalid credentials",
      401
    );
  }

  const isPasswordValid = await bcrypt.compare(
    password,
    user.password
  );

  if (!isPasswordValid) {
    throw new Error("Invalid credentials");
  }

  const token = jwt.sign(
    {
      userId: user.id
    },
    process.env.JWT_SECRET as string,
    {
      expiresIn: "7d"
    }
  );

  return {
    token
  };
};