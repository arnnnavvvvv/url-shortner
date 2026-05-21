import {
  Request,
  Response,
  NextFunction
} from "express";

import { RateLimiterRedis }
from "rate-limiter-flexible";

import redisClient
from "../config/redis";

const rateLimiter =
  new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: "rate_limit",
    points: 100,
    duration: 60
  });

export const rateLimiterMiddleware =
  async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {

    try {

      const ip = req.ip;

      await rateLimiter.consume(ip!);

      next();

    } catch {

      return res.status(429).json({
        success: false,
        message: "Too many requests"
      });

    }

  };