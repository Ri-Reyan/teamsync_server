import express from "express";
import verifyUser from "../../../../../middleware/verifyUser.js";
import { PlatformRole } from "../../../../../generated/prisma/enums.js";
import { AIController } from "./ai.controller.js";
const aiRouter = express.Router({ mergeParams: true });
aiRouter.post("/ai/chat", verifyUser(PlatformRole.USER), AIController.AIChat);
aiRouter.post("/ai/summary", verifyUser(PlatformRole.USER), AIController.generateProjectSummary);
aiRouter.get("/ai/conversations", verifyUser(PlatformRole.USER), AIController.getPreviousConversation);
export default aiRouter;
