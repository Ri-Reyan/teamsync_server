import express from "express";
import cors from "cors";
import { credentials } from "./config/credentials.js";
import helmet from "helmet";
import { Request, Response } from "express";
import { globalErrorHandler } from "./global/errorHandler.js";
import authRouter from "./module/auth/auth.route.js";
import "./lib/passport.js";
import passport from "passport";
import userRouter from "./module/user/user.route.js";

const app = express();

app.use(
  cors({
    origin: credentials.client_url,
    credentials: true,
  }),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(helmet());
app.use(passport.initialize());

app.get("/", (req: Request, res: Response) => {
  res.send({
    success: true,
    message: "Server is running",
  });
});

app.use("/api/v1/auth", authRouter);

app.use("/api/v1/user", userRouter);

app.use(globalErrorHandler);

export default app;
