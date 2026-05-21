import { z } from "zod";

export const createUrlSchema = z.object({
  originalUrl: z.url()
});

export const registerSchema = z.object({
  email: z.email(),
  password: z.string().min(6)
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string()
});