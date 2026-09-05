import express from "express";
import { authControllers } from "./auth.controller.js";

const authRouter = express.Router();

authRouter.post("/register", authControllers.register);
authRouter.post("/verify-email", authControllers.verifyRegistrationEmail);

export default authRouter;
