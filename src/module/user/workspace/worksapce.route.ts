import { Router } from "express";
import { workspaceController } from "./worksapce.controller.js";
import verifyUser from "../../../middleware/verifyUser.js";
import { PlatformRole } from "../../../generated/prisma/enums.js";
import invitationRouter from "./invite/invite.route.js";
import memberRouter from "./member/member.route.js";

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

workspaceRouter.delete(
  "/:workspaceId/leave",
  verifyUser(PlatformRole.USER),
  workspaceController.leaveWorkspace,
);

workspaceRouter.get(
  "/user/workspace/:workspaceId/members",
  verifyUser(PlatformRole.USER),
  workspaceController.getWorkspace,
);

workspaceRouter.patch(
  "/user/workspace/:workspaceId/transfer-ownership",
  verifyUser(PlatformRole.USER),
  workspaceController.transferWorkspaceOwnership,
);

// mount invitation
workspaceRouter.use(invitationRouter);

// mount member
workspaceRouter.use("/", memberRouter);

export default workspaceRouter;
