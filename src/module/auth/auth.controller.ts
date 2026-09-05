import { Request, Response } from "express";
import { registerValidation } from "./auth.schema.js";
import AppError from "../../global/AppError.js";
import { authService } from "./auth.service.js";
import sendResponse from "../../global/sendResponse.js";
import { sendEmail } from "../../utils/sendEmail.js";
import ejs from "ejs";
import path from "path";
import { genOtp } from "../../utils/otp.js";
import catchAsync from "../../global/catchAsync.js";

const register = catchAsync(async (req: Request, res: Response) => {
  const result = registerValidation.safeParse(req.body);

  if (!result.success) {
    throw new AppError(result.error.issues[0].message, 400);
  }

  const user = await authService.registeUserService(result.data);

  const otpCode = genOtp();

  const templatePath = path.join(process.cwd(), "src/views/verify-email.ejs");

  const html = await ejs.renderFile(templatePath, {
    username: user.username,
    otpCode: otpCode,
    expiresIn: 15,
  });

  const sendEmailPayload = {
    to: user.email,
    subject: "Welcome to Team Sync",
    html,
  };

  sendEmail(sendEmailPayload);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "user registration successfull",
    data: user,
  });
});

const verifyRegistrationOtp = catchAsync(async () => {});

export const authControllers = {
  register,
};
