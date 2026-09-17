import "./global/globalUser.js";
import express from "express";
import cors from "cors";
import { credentials } from "./config/credentials.js";
import helmet from "helmet";
import { Request, Response } from "express";
import { globalErrorHandler } from "./global/errorHandler.js";
import authRouter from "./module/auth/auth.route.js";
import "./lib/passport.js";
import passport from "passport";
import worksapceRouter from "./module/user/workspace/worksapce.route.js";
import cookieParser from "cookie-parser";
import paymentRouter from "./module/user/payment/payment.route.js";
import adminPanelRouter from "./module/admin/panel/panel.route.js";
import rateLimiter from "./middleware/rateLimiter.js";

const app = express();

app.use(
  cors({
    origin: [
      String(credentials.client_url),
      String(credentials.client_url_test),
    ],
    credentials: true,
  }),
);

app.use(cookieParser());
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

app.use(
  "/api/v1/auth",
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 100, keyPrefix: "auth" }),
  authRouter,
);

app.use(
  "/api/v1/user/workspace",
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 300, keyPrefix: "workspace" }),
  worksapceRouter,
);

app.use(
  "/api/v1/user/payment",
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 30, keyPrefix: "payment" }),
  paymentRouter,
);

app.use(
  "/api/v1/admin/panel",
  rateLimiter({ windowMs: 15 * 60 * 1000, max: 100, keyPrefix: "admin" }),
  adminPanelRouter,
);

app.use(globalErrorHandler);

export default app;
