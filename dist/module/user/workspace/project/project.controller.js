import AppError from "../../../../global/AppError.js";
import catchAsync from "../../../../global/catchAsync.js";
import { CreateProjectSchema, UpdateProjectSchema } from "./project.schema.js";
import { projectServices } from "./project.service.js";
import sendResponse from "../../../../global/sendResponse.js";
const getProject = catchAsync(async (req, res) => {
    const workspaceId = req.params.workspaceId;
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
    const projects = await projectServices.getProjectService(payload);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "projects fetched successfully",
        data: projects,
    });
});
const createProject = catchAsync(async (req, res) => {
    const workspaceId = req.params.workspaceId;
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
    const project = await projectServices.createProjectService(payload);
    sendResponse(res, {
        success: true,
        statusCode: 201,
        message: "project created successfully",
        data: project,
    });
});
const updateProject = catchAsync(async (req, res) => {
    const result = UpdateProjectSchema.safeParse(req.body);
    if (!result.success) {
        throw new AppError(result.error.issues[0].message, 400);
    }
    const workspaceId = req.params.workspaceId;
    const projectId = req.params.projectId;
    const userId = req.user?.id;
    const payload = {
        workspaceId,
        projectId,
        userId,
        name: result.data.name,
        description: result.data.description,
    };
    const updatedProject = await projectServices.updateProjectService(payload);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Project updated successfully",
        data: updatedProject,
    });
});
const deleteProject = catchAsync(async (req, res) => {
    const workspaceId = req.params.workspaceId;
    const projectId = req.params.projectId;
    const userId = req.user?.id;
    const payload = {
        workspaceId,
        projectId,
        userId,
    };
    const deleteProject = await projectServices.deleteProjectService(payload);
    sendResponse(res, {
        success: true,
        statusCode: 200,
        message: "Project deleted successfully",
    });
});
export const projectController = {
    getProject,
    createProject,
    updateProject,
    deleteProject,
};
