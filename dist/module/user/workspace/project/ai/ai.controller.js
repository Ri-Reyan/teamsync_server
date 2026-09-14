import catchAsync from "../../../../../global/catchAsync.js";
import AppError from "../../../../../global/AppError.js";
import { AIService } from "./ai.service.js";
import sendResponse from "../../../../../global/sendResponse.js";
const aiSummary = catchAsync(async (req, res) => { });
const getPreviousonversation = catchAsync(async (req, res) => {
    const workspaceId = req.params.workspaceId;
    if (!workspaceId) {
        throw new AppError("workspace id must required", 400);
    }
    const projectId = req.params.projectId;
    if (!workspaceId) {
        throw new AppError("workspace id must required", 400);
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
