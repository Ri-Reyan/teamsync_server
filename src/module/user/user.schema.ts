import z from "zod";

export const AddWorksapceSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Workspace name must be at least 3 charecters" })
    .max(100, {
      message: "Workspace name must be smaller than 100 charecters",
    }),
});
