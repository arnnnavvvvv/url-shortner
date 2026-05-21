import { Router } from "express";

import {createUrl,getUrls,removeUrl} from "../controllers/url.controller";

import {authenticate} from "../middleware/auth.middleware";

const router = Router();
/**
 * @swagger
 * /urls:
 *   post:
 *     summary: Create short URL
 *     tags:
 *       - URLs
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               originalUrl:
 *                 type: string
 *     responses:
 *       201:
 *         description: Short URL created
 */

router.post("/",authenticate,createUrl);

/**
 * @swagger
 * /urls:
 *   get:
 *     summary: Get all URLs for logged in user
 *     tags:
 *       - URLs
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user URLs
 */

router.get("/",authenticate,getUrls);

/**
 * @swagger
 * /urls/{id}:
 *   delete:
 *     summary: Delete a URL
 *     tags:
 *       - URLs
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: URL ID
 *     responses:
 *       200:
 *         description: URL deleted successfully
 *       404:
 *         description: URL not found
 *       403:
 *         description: Unauthorized
 */

router.delete("/:id",authenticate,removeUrl);

export default router;