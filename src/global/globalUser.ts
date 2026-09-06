import { Request } from "express";

type User = {
  id: string;
  username: string;
  email: string;
  platformRole: string;
  isPremium: boolean;
};

declare global {
  namespace Express {
    interface Request {
      user?: User;
    }
  }
}

export {};
