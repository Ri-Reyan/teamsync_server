import AppError from "../../../global/AppError.js";
import { prisma } from "../../../lib/prisma.js";
import {
  CreateWorkspacePayload,
  UpdateWorkspacePayload,
} from "./worksapce.interface.js";

const createWorkspaceService = async (payload: CreateWorkspacePayload) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
  });

  if (!user) {
    throw new AppError("User not found", 404);
  }

  if (user.status !== "ACTIVE") {
    throw new AppError("Account is suspended or inactive", 403);
  }

  const existingWorkspacesCount = await prisma.workspace.count({
    where: { owner_id: user.id },
  });

  if (!user.isPremium && existingWorkspacesCount >= 1) {
    throw new AppError(
      "Please upgrade your package to create more workspaces",
      400,
    );
  }

  const workspace = await prisma.$transaction(async (tx) => {
    const createdWorkspace = await tx.workspace.create({
      data: {
        name: payload.name,
        owner_id: user.id,
      },
    });

    await tx.member.create({
      data: {
        workspace_id: createdWorkspace.id,
        user_id: user.id,
        role: "ADMIN",
      },
    });

    return createdWorkspace;
  });

  return workspace;
};

const updateWorkspaceService = async (payload: UpdateWorkspacePayload) => {
  const existingWorkspace = await prisma.workspace.findFirst({
    where: {
      id: payload.workspace_id,
      owner_id: payload.id,
    },
  });

  if (!existingWorkspace) {
    throw new AppError(
      "Workspace not found or you don't have permission to edit",
      404,
    );
  }

  const updatedWorkspace = await prisma.workspace.update({
    where: { id: payload.workspace_id },
    data: { name: payload.name },
  });

  return updatedWorkspace;
};

const removeWorkspaceService = async (workspaceId: string, userId: string) => {
  const existingWorkspace = await prisma.workspace.findFirst({
    where: {
      id: workspaceId,
      ownerId: userId,
    },
  });

  if (!existingWorkspace) {
    throw new AppError(
      "Workspace not found or you don't have permission to delete",
      404,
    );
  }

  await prisma.workspace.delete({
    where: { id: workspaceId },
  });

  return null;
};

export const workspaceService = {
  createWorkspaceService,
  updateWorkspaceService,
  removeWorkspaceService,
};
