import { JwtPayload, SignOptions } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { Response } from "express";

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
  const isProduction = process.env.NODE_ENV === "production";

  res.cookie(name, value, {
    httpOnly: true,
    secure: isProduction, // প্রোডাকশনে true, লোকাল ডেভেলপমেন্টে false থাকবে
    sameSite: isProduction ? "none" : "lax", // Localhost ও Cross-domain অ্যাডজাস্টমেন্ট
    path: "/", // 👈 অত্যন্ত গুরুত্বপূর্ণ: এটি না দিলে অন্য রুটে কুকি যাবে না
    maxAge:
      name === "refreshToken" ? 1000 * 60 * 60 * 24 * 7 : 1000 * 60 * 60 * 24,
  });
};
