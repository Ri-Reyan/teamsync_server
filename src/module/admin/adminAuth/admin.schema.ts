import * as z from "zod";

export const adminLoginSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  password: z.string().min(1, "Password is required"),
});

export const createAdminSchema = z.object({
  username: z
    .string()
    .trim()
    .min(5, "Username must be at least 5 characters")
    .max(50, "Username must be smaller than 50 characters"),
  email: z.string().trim().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(200, "Password must be smaller than 200 characters"),
});

export const verifyAdminSchema = z.object({
  email: z.string().trim().email("Invalid email address"),
  otp: z.string().length(6, "OTP must be exactly 6 characters"),
});
