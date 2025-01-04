import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  nickname: z.string().min(3),
  name: z.string().min(1),
  timezone: z.string(),
  token: z.string().uuid()
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string()
});

export const createInviteSchema = z.object({
  adminNickname: z.string().min(3)
});