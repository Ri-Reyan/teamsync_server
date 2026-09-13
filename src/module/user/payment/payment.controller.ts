import AppError from "../../../global/AppError.js";
import catchAsync from "../../../global/catchAsync.js";
import { Request, Response } from "express";
import { paymentService } from "./payment.service.js";

const createPayment = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError("user not  found", 400);
  }

  const payment = await paymentService.createPaymentService(
    userId,
    req.body.package,
  );

  res.status(200).json({
    success: true,
    message: "Payment session created successfully",
    data: payment,
  });
});

const confirmPayment = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;

  if (!userId) {
    throw new AppError("User not found", 401);
  }

  const user = await paymentService.confirmPaymentService(
    userId,
    req.body.sessionId,
  );

  res.status(200).json({
    success: true,
    message: "Payment confirmed successfully",
    data: user,
  });
});

const paymentControler = {
  createPayment,
  confirmPayment,
};

export default paymentControler;
