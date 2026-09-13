import express from "express";
import verifyUser from "../../../middleware/verifyUser.js";
import { PlatformRole } from "../../../generated/prisma/enums.js";
import paymentController from "./payment.controller.js";
const paymentRouter = express.Router();
paymentRouter.post("/checkout", verifyUser(PlatformRole.USER, PlatformRole.ADMIN), paymentController.createPayment);
paymentRouter.post("/confirm", verifyUser(PlatformRole.USER, PlatformRole.ADMIN), paymentController.confirmPayment);
export default paymentRouter;
