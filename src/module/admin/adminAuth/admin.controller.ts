import { Request, Response } from "express";
import catchAsync from "../../../global/catchAsync.js";
import AppError from "../../../global/AppError.js";
import sendResponse from "../../../global/sendResponse.js";
import { credentials } from "../../../config/credentials.js";
import { generateToken, sendCookie } from "../../../utils/token.js";
import { adminAuthService } from "./admin.service.js";
import {
  adminLoginSchema,
  createAdminSchema,
  verifyAdminSchema,
} from "./admin.schema.js";

const login = catchAsync(async (req: Request, res: Response) => {
  const result = adminLoginSchema.safeParse(req.body);
  if (!result.success) throw new AppError(result.error.issues[0].message, 400);

  const admin = await adminAuthService.loginAdmin(
    result.data.email,
    result.data.password,
  );
  const tokenPayload = {
    id: admin.id,
    username: admin.username,
    email: admin.email,
    platformRole: admin.platformRole,
    isPremium: admin.isPremium,
    package: admin.package,
  };

  sendCookie(
    res,
    "accessToken",
    generateToken(
      credentials.jwt_access_token_secret,
      tokenPayload,
      credentials.jwt_access_token_expires,
    ),
  );
  sendCookie(
    res,
    "refreshToken",
    generateToken(
      credentials.jwt_refresh_token_secret,
      tokenPayload,
      credentials.jwt_refresh_token_expires,
    ),
  );

  return sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Admin logged in successfully",
    data: {
      id: admin.id,
      username: admin.username,
      email: admin.email,
      role: admin.platformRole,
    },
  });
});

const createAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = createAdminSchema.safeParse(req.body);
  if (!result.success) throw new AppError(result.error.issues[0].message, 400);

  await adminAuthService.requestAdminCreation(result.data);
  return sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "A 6 digit OTP was sent to the new admin email",
    data: { email: result.data.email },
  });
});

const verifyAdmin = catchAsync(async (req: Request, res: Response) => {
  const result = verifyAdminSchema.safeParse(req.body);
  if (!result.success) throw new AppError(result.error.issues[0].message, 400);

  const admin = await adminAuthService.verifyAdminCreation(
    result.data.email,
    result.data.otp,
  );
  return sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Admin created successfully",
    data: admin,
  });
});

const logout = catchAsync(async (_req: Request, res: Response) => {
  res.clearCookie("accessToken");
  res.clearCookie("refreshToken");
  return sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Admin logged out successfully",
  });
});

export const adminAuthController = { login, createAdmin, verifyAdmin, logout };
