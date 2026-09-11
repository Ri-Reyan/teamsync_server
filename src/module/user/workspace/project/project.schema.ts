import z from "zod";

export const CreateProjectSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 charecters" })
    .max(100, { message: "Name must be smaller than 100 charecters" }),
  description: z
    .string()
    .min(5, { message: "Description must be at least 5 charecters" })
    .max(100, { message: "Description must be smaller than 250 charecters" }),
});
