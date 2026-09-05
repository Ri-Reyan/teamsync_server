import { Request, Response } from "express";
import { registerValidation, verifyOtpValidation } from "./auth.schema.js";
import AppError from "../../global/AppError.js";
import { authService } from "./auth.service.js";
import sendResponse from "../../global/sendResponse.js";
import catchAsync from "../../global/catchAsync.js";

const register = catchAsync(async (req: Request, res: Response) => {
  const result = registerValidation.safeParse(req.body);

  if (!result.success) {
    throw new AppError(result.error.issues[0].message, 400);
  }

  await authService.registeUserService(result.data);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "A 6 digit otp sent to your email.",
    data: {
      username: result.data.username,
      email: result.data.email,
    },
  });
});

const verifyRegistrationEmail = catchAsync(
  async (req: Request, res: Response) => {
    const result = verifyOtpValidation.safeParse(req.body);

    if (!result.success) {
      throw new AppError(result.error.issues[0].message, 400);
    }

    const user = await authService.verifyRegistrationOtpService(result.data);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "Email verified successfully",
      data: user,
    });
  },
);

export const authControllers = {
  register,
  verifyRegistrationEmail,
};
