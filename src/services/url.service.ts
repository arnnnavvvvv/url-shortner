import prisma from "../config/db";
import { nanoid } from "nanoid";
import { AppError } from "../utils/AppError";
import redisClient from "../config/redis";

export const createShortUrl = async (
  originalUrl: string,
  userId: number
) => {

  const shortCode = nanoid(6);

  const url = await prisma.url.create({
    data: {
      originalUrl,
      shortCode,
      userId
    }
  });

  return url;
};

export const getUserUrls = async (
  userId: number
) => {

  return prisma.url.findMany({
    where: {
      userId
    },
    orderBy: {
      createdAt: "desc"
    }
  });
};

export const deleteUrl = async (
  id: number,
  userId: number
) => {

  const url = await prisma.url.findUnique({
    where: {
      id
    }
  });

  if (!url) {
    throw new AppError(
     "URL not found",
      404
    );
  }

  if (url.userId !== userId) {
    throw new AppError(
     "Unauthorized",
     403
    );
  }

  await prisma.url.delete({
    where: {
      id
    }
  });

  return true;
};

export const getOriginalUrl = async (
  shortCode: string
) => {

  const cachedUrl =
    await redisClient.get(
      `url:${shortCode}`
    );

  if (cachedUrl) {

    console.log("Cache HIT");

    return cachedUrl;

  }

  console.log("Cache MISS");

  const url =
    await prisma.url.findUnique({
      where: {
        shortCode
      }
    });

  if (!url) {
    throw new AppError(
      "URL not found",
      404
    );
  }

  await prisma.url.update({
    where: {
      id: url.id
    },
    data: {
      clickCount: {
        increment: 1
      }
    }
  });

  await redisClient.set(
    `url:${shortCode}`,
    url.originalUrl,
    {
      EX: 3600
    }
  );

  return url.originalUrl;
};