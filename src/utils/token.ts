import { JwtPayload, SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { Response } from "express";
import { credentials } from "../config/credentials.js";

export const generateToken = (
  secret: string,
  payload: string | JwtPayload,
  time: SignOptions["expiresIn"],
) => {
  return jwt.sign(payload, secret, {
    expiresIn: time,
  });
};

export const verifyToken = (token: string, secret: string) => {
  return jwt.verify(token, secret);
};

export const sendCookie = (res: Response, name: string, value: string) => {
  const isProduction =
    credentials.node_env === "production" || process.env.VERCEL === "1";

  res.cookie(name, value, {
    httpOnly: true,
    secure: isProduction,
    sameSite: isProduction ? "none" : "lax",
    path: "/",
    maxAge:
      name === "refreshToken" ? 1000 * 60 * 60 * 24 * 7 : 1000 * 60 * 60 * 24,
  });
};
