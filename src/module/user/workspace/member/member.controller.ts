import { Request, Response } from "express";
import { memberService } from "./member.service.js";
import AppError from "../../../../global/AppError.js";
import sendResponse from "../../../../global/sendResponse.js";
import catchAsync from "../../../../global/catchAsync.js";

const getWorkspaceMembers = catchAsync(async (req: Request, res: Response) => {
  const workspace_id =
    (req.params.id as string) || (req.params.workspace_id as string);
  const user = req.user;

  if (!user) {
    throw new AppError("Unauthorized access", 401);
  }

  if (!workspace_id) {
    throw new AppError("Workspace ID is required", 400);
  }

  const result = await memberService.getWorkspaceMembersService({
    workspace_id,
    user_id: user.id,
  });

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Members retrieved successfully",
    data: result,
  });
});

const deleteWorkspaceMember = catchAsync(
  async (req: Request, res: Response) => {
    const workspace_id =
      (req.params.id as string) || (req.params.workspace_id as string);
    const member_id = req.params.member_id as string;
    const user = req.user;

    if (!user) {
      throw new AppError("Unauthorized access", 401);
    }

    if (!workspace_id || !member_id) {
      throw new AppError("Workspace ID and Member ID are required", 400);
    }

    await memberService.deleteWorkspaceMemberService({
      workspace_id,
      member_id,
      requested_by_user_id: user.id,
    });

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Member removed successfully",
      data: null,
    });
  },
);

export const memberController = {
  getWorkspaceMembers,
  deleteWorkspaceMember,
};
