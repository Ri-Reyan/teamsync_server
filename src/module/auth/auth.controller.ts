import { Request, Response } from "express";
import { registerValidation } from "./auth.schema.js";
import AppError from "../../global/AppError.js";
import { authService } from "./auth.service.js";

export const register = async (req: Request, res: Response) => {
  const result = registerValidation.safeParse(req.body);

  if (!result.success) {
    throw new AppError(result.error.issues[0].message, 400);
  }

  const user = await authService.registeUserService(result.data);
};
