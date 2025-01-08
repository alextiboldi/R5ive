import { z } from "zod";

export const signUpSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6, "Password must be at least 6 characters"),
  nickname: z.string().min(3, "Nickname must be at least 3 characters"),
  timezone: z.string(),
  token: z.string().uuid(),
});

export const signInSchema = z.object({
  email: z.string().email(),
  password: z.string(),
});

export const createInviteSchema = z.object({
  adminNickname: z.string().min(3),
});
export const announcementSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().min(1, "Description is required"),
});
export const pollSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  type: z.enum(["REGULAR", "TIME"]).default("REGULAR"),
});

export const timePollSchema = z.object({
  title: z.string().min(1, "Title is required"),
  description: z.string().optional(),
  timeSlots: z
    .array(
      z.object({
        dayOfWeek: z.enum([
          "MONDAY",
          "TUESDAY",
          "WEDNESDAY",
          "THURSDAY",
          "FRIDAY",
          "SATURDAY",
          "SUNDAY",
        ]),
        timeGmt: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/),
      })
    )
    .min(1, "At least one time slot is required"),
});
