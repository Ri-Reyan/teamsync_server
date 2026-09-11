import AppError from "../../../../global/AppError.js";
import { prisma } from "../../../../lib/prisma.js";
import {
  CreateProjectPayloadType,
  GetProjectPayloadType,
} from "./project.interface.js";

const getProjectService = async (payload: GetProjectPayloadType) => {
  const { workspaceId, userId } = payload;

  const isWorkspaceExits = await prisma.workspace.findUnique({
    where: {
      id: workspaceId,
    },
  });

  if (!isWorkspaceExits) {
    throw new AppError("workspace not found", 400);
  }

  const isMemberExists = await prisma.member.findUnique({
    where: {
      workspace_id_user_id: {
        workspace_id: workspaceId,
        user_id: userId,
      },
    },
  });

  if (!isMemberExists) {
    throw new AppError("You are not member of this workspace", 400);
  }

  const project = await prisma.project.findMany({
    where: {
      workspace_id: workspaceId,
    },
  });

  return project;
};

const createProjectService = async (payload: CreateProjectPayloadType) => {
  const { workspaceId, userId, name, description } = payload;

  const isWorkspaceExists = await prisma.workspace.findFirst({
    where: {
      id: workspaceId,
    },
  });

  if (!isWorkspaceExists) {
    throw new AppError("workspace not found", 400);
  }

  const isMemberExists = await prisma.member.findUnique({
    where: {
      workspace_id_user_id: {
        workspace_id: workspaceId,
        user_id: userId,
      },
    },
  });

  if (!isMemberExists) {
    throw new AppError("You are not member of this workspace", 403);
  }

  const project = await prisma.$transaction(async (tx) => {
    const createdProject = await tx.project.create({
      data: {
        name,
        description,
        workspace_id: workspaceId,
      },
    });

    await tx.workspace.update({
      where: {
        id: workspaceId,
      },
      data: {
        project_count: {
          increment: 1,
        },
      },
    });

    return createdProject;
  });

  return project;
};

export const projectService = {
  getProjectService,
  createProjectService,
};
