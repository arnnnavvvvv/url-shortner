import { Response } from "express";

import {
  createShortUrl,
  deleteUrl,
  getOriginalUrl,
  getUserUrls
} from "../services/url.service";

import { createUrlSchema } from "../utils/validators";

import { AuthRequest } from "../middleware/auth.middleware";

export const createUrl = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const validatedData =
      createUrlSchema.parse(req.body);

    const url = await createShortUrl(
      validatedData.originalUrl,
      req.userId!
    );

    res.status(201).json({
      shortUrl:
        `http://localhost:5000/${url.shortCode}`,
      url
    });

  } catch (error: any) {

    res.status(400).json({
      error: error.message
    });

  }
};

export const getUrls = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const urls = await getUserUrls(
      req.userId!
    );

    res.json(urls);

  } catch (error: any) {

    res.status(500).json({
      error: error.message
    });

  }
};

export const removeUrl = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const id = Number(req.params.id);

    if (isNaN(id)) {
      return res.status(400).json({
        error: "Invalid ID"
      });
    }

    await deleteUrl(
      id,
      req.userId!
    );

    res.json({
      message: "URL deleted"
    });

  } catch (error: any) {

    res.status(400).json({
      error: error.message
    });

  }
};

export const redirectToUrl = async (
  req: AuthRequest,
  res: Response
) => {

  try {

    const { shortCode } = req.params;

    if (typeof shortCode !== "string") {
      return res.status(400).json({
        error: "Invalid short code"
      });
    }

    const originalUrl =
      await getOriginalUrl(shortCode);

    return res.redirect(originalUrl);

  } catch (error: any) {

    res.status(404).json({
      error: error.message
    });

  }
};