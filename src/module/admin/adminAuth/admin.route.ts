import express from "express";
import verifyUser from "../../../middleware/verifyUser.js";
import { PlatformRole } from "../../../generated/prisma/enums.js";
import { adminAuthController } from "./admin.controller.js";

const adminAuthRouter = express.Router();

adminAuthRouter.post("/login", adminAuthController.login);
adminAuthRouter.post(
  "/admins",
  verifyUser(PlatformRole.ADMIN),
  adminAuthController.createAdmin,
);
adminAuthRouter.post(
  "/admins/verify",
  verifyUser(PlatformRole.ADMIN),
  adminAuthController.verifyAdmin,
);
adminAuthRouter.post("/logout", adminAuthController.logout);

export default adminAuthRouter;
