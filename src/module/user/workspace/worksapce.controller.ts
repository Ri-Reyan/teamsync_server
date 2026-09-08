import { Request, Response } from "express";
import catchAsync from "../../../global/catchAsync.js";
import AppError from "../../../global/AppError.js";
import sendResponse from "../../../global/sendResponse.js";
import { createWorkspaceSchema } from "./worksapce.schema.js";
import { workspaceService } from "./worksapce.service.js";
import { prisma } from "../../../lib/prisma.js";

const getWorkspace = catchAsync(async (req: Request, res: Response) => {
  const user = req.user;

  const workspace = await prisma.workspace.findMany({
    where: {
      owner_id: user?.id,
    },
  });

  if (workspace.length <= 0) {
    throw new AppError("Workspace not found", 400);
  }

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Workspace fetched successfuly",
    data: workspace,
  });
});

const createWorkspace = catchAsync(async (req: Request, res: Response) => {
  const result = createWorkspaceSchema.safeParse(req.body);

  if (!result.success) {
    throw new AppError(result.error.issues[0].message, 400);
  }

  const user = req.user;
  if (!user) {
    throw new AppError("Unauthorized access", 401);
  }

  const payload = {
    id: user.id,
    email: user.email,
    platformRole: user.platformRole,
    isPremium: user.isPremium,
    name: result.data.name,
  };

  const workspace = await workspaceService.createWorkspaceService(payload);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Workspace created successfully",
    data: workspace,
  });
});

const updateWorkspace = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError("Workspace ID is required", 400);
  }

  const result = createWorkspaceSchema.safeParse(req.body);
  if (!result.success) {
    throw new AppError(result.error.issues[0].message, 400);
  }

  const user = req.user;
  if (!user) {
    throw new AppError("Unauthorized access", 401);
  }

  const payload = {
    id: user.id,
    email: user.email,
    platformRole: user.platformRole,
    isPremium: user.isPremium,
    name: result.data.name,
    workspace_id: id as string,
  };

  const workspace = await workspaceService.updateWorkspaceService(payload);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Workspace updated successfully",
    data: workspace,
  });
});

const removeWorkspace = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  if (!id) {
    throw new AppError("Workspace ID is required", 400);
  }

  const user = req.user;
  if (!user) {
    throw new AppError("Unauthorized access", 401);
  }

  await workspaceService.removeWorkspaceService(id as string, user.id);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Workspace deleted successfully",
  });
});

export const workspaceController = {
  getWorkspace,
  createWorkspace,
  updateWorkspace,
  removeWorkspace,
};
