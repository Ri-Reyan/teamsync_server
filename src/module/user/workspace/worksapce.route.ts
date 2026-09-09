import { Router } from "express";
import { workspaceController } from "./worksapce.controller.js";
import verifyUser from "../../../middleware/verifyUser.js";
import { PlatformRole } from "../../../generated/prisma/enums.js";
import invitationRouter from "./invite/invite.route.js";

const workspaceRouter = Router();

// Fetch workspace
workspaceRouter.get(
  "/",
  verifyUser(PlatformRole.USER),
  workspaceController.getWorkspace,
);

// Cretae workspace
workspaceRouter.post(
  "/",
  verifyUser(PlatformRole.USER),
  workspaceController.createWorkspace,
);

// Update Workspace
workspaceRouter.patch(
  "/:id",
  verifyUser(PlatformRole.USER),
  workspaceController.updateWorkspace,
);

// Delete Workspace
workspaceRouter.delete(
  "/:id",
  verifyUser(PlatformRole.USER),
  workspaceController.removeWorkspace,
);

workspaceRouter.use(invitationRouter);

export default workspaceRouter;
