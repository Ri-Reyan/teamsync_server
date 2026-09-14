import catchAsync from "../../../../../global/catchAsync.js";
import { Request, Response } from "express";
import AppError from "../../../../../global/AppError.js";
import { AIService } from "./ai.service.js";
import sendResponse from "../../../../../global/sendResponse.js";

const aiSummary = catchAsync(async (req: Request, res: Response) => {});

const getPreviousonversation = catchAsync(
  async (req: Request, res: Response) => {
    const workspaceId = req.params.workspaceId as string;

    if (!workspaceId) {
      throw new AppError("workspace id must required", 400);
    }

    const projectId = req.params.projectId as string;

    if (!workspaceId) {
      throw new AppError("workspace id must required", 400);
    }

    const userId = req.user?.id as string;

    if (!userId) {
      throw new AppError("User not found", 400);
    }

    const payload = {
      workspaceId,
      projectId,
      userId,
    };

    const conversations = await AIService.getConversationService(payload);

    sendResponse(res, {
      success: true,
      statusCode: 200,
      message: "All coversation fetched",
      data: conversations,
    });
  },
);
