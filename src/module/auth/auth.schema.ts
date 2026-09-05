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
