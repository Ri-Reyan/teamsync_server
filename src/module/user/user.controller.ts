import catchAsync from "../../global/catchAsync.js";
import { Request, Response } from "express";
import { AddWorksapceSchema } from "./user.schema.js";
import AppError from "../../global/AppError.js";

const addWorkspace = catchAsync(async (req: Request, res: Response) => {
  const result = AddWorksapceSchema.safeParse(req.body);

  if (!result.success) {
    throw new AppError(result.error.issues[0].message, 400);
  }
});
