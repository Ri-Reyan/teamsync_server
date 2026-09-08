import { PlatformRole } from "../generated/prisma/enums.js";

declare global {
  namespace Express {
    // অন্য প্যাকেজ যে 'User' ইন্টারফেস খোঁজে, তাকে রিডিক্লেয়ার করা
    interface User {
      id: string;
      username: string;
      email: string;
      platformRole: PlatformRole;
      isPremium: boolean;
    }

    interface Request {
      user?: User;
    }
  }
}

export {};
