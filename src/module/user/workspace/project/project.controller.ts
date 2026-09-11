import AppError from "../../../../global/AppError.js";
import catchAsync from "../../../../global/catchAsync.js";
import { Request, Response } from "express";
import { CreateProjectSchema } from "./project.schema.js";
import { projectService } from "./project.service.js";
import sendResponse from "../../../../global/sendResponse.js";

const getProject = catchAsync(async (req: Request, res: Response) => {
  const workspaceId = req.params.workspace as string;

  if (!workspaceId) {
    throw new AppError("workspaceId must required", 400);
  }

  const userId = req.user?.id;

  if (!userId) {
    throw new AppError("user not found", 400);
  }

  const payload = {
    workspaceId,
    userId,
  };

  const projects = await projectService.getProjectService(payload);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "projects fetched successfully",
    data: projects,
  });
});

const createProject = catchAsync(async (req: Request, res: Response) => {
  const workspaceId = req.params.workspaceId as string;

  if (!workspaceId) {
    throw new AppError("workspace id must required", 400);
  }

  const userId = req.user?.id;

  if (!userId) {
    throw new AppError("user not found", 400);
  }

  const result = CreateProjectSchema.safeParse(req.body);

  if (!result.success) {
    throw new AppError(result.error.issues[0].message, 400);
  }

  if (!userId) {
    throw new AppError("user not found", 400);
  }

  const payload = {
    workspaceId,
    userId,
    name: result.data.name,
    description: result.data.description,
  };

  const project = await projectService.createProjectService(payload);

  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "project created successfully",
    data: project,
  });
});

export const projectController = {
  createProject,
};
