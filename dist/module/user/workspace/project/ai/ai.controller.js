import catchAsync from "../../../../../global/catchAsync.js";
import AppError from "../../../../../global/AppError.js";
import { AIService } from "./ai.service.js";
import sendResponse from "../../../../../global/sendResponse.js";
const AIChat = catchAsync(async (req, res) => {
    const workspaceId = req.params.workspaceId;
    if (!workspaceId) {
        throw new AppError("workspace id must required", 400);
    }
    const projectId = req.params.projectId;
    if (!projectId) {
        throw new AppError("project id must required", 400);
    }
    const userId = req.user?.id;
    if (!userId) {
        throw new AppError("User not found", 400);
    }
    const payload = {
        workspaceId,
        projectId,
        userId,
        userMessage: req.body?.prompt ?? req.body?.user_prompt,
    };
    const result = await AIService.generateChatResponseService(payload);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "AI response generated successfully",
        data: { result },
    });
});
const generateProjectSummary = catchAsync(async (req, res) => {
    const workspaceId = req.params.workspaceId;
    const projectId = req.params.projectId;
    const userId = req.user?.id;
    if (!workspaceId || !projectId) {
        throw new AppError("workspace id and project id are required", 400);
    }
    if (!userId) {
        throw new AppError("User not found", 400);
    }
    const result = await AIService.generateProjectSummaryService({
        workspaceId,
        projectId,
        userId,
    });
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Project summary generated successfully",
        data: { result },
    });
});
const getPreviousConversation = catchAsync(async (req, res) => {
    const workspaceId = req.params.workspaceId;
    const projectId = req.params.projectId;
    if (!workspaceId || !projectId) {
        throw new AppError("workspace id and project id are required", 400);
    }
    const userId = req.user?.id;
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
});
export const AIController = {
    AIChat,
    generateProjectSummary,
    getPreviousConversation,
};
