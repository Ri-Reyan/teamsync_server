import * as z from "zod";

export const registerValidation = z.object({
  username: z
    .string()
    .min(5, { message: "Username must be at least 8 charecters" })
    .max(50, { message: "Username must be smaller than 50" }),
  email: z.string().trim().email(),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 charecters" }),
});

export const verifyOtpValidation = z.object({
  email: z.string().trim().email(),
  otp: z
    .string()
    .min(6, { message: "OTP must be exact 6 charecters" })
    .max(6, { message: "OTP must be exact 6 charecters" }),
});
