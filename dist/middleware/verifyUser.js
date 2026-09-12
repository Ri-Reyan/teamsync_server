import catchAsync from "../global/catchAsync.js";
import { generateToken, sendCookie, verifyToken } from "../utils/token.js";
import AppError from "../global/AppError.js";
import { prisma } from "../lib/prisma.js";
import { credentials } from "../config/credentials.js";
const verifyUser = (...allowedRoles) => catchAsync(async (req, res, next) => {
    const accessToken = req.cookies?.accessToken;
    const refreshToken = req.cookies?.refreshToken;
    if (!accessToken && !refreshToken) {
        throw new AppError("Unauthorized access. Please login.", 401);
    }
    let decoded = null;
    let isAccessTokenExpired = false;
    if (accessToken) {
        try {
            decoded = verifyToken(accessToken, credentials.jwt_access_token_secret);
        }
        catch (error) {
            isAccessTokenExpired = true;
        }
    }
    if ((!decoded || isAccessTokenExpired) && refreshToken) {
        try {
            decoded = verifyToken(refreshToken, credentials.jwt_refresh_token_secret);
        }
        catch (error) {
            throw new AppError("Session expired. Please login again.", 401);
        }
    }
    if (!decoded) {
        throw new AppError("Unauthorized access", 401);
    }
    const user = await prisma.user.findUnique({
        where: { id: decoded.id },
    });
    if (!user) {
        throw new AppError("User account no longer exists.", 401);
    }
    if (user.status !== "ACTIVE") {
        throw new AppError("Account is suspended", 403);
    }
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.platformRole)) {
        throw new AppError("Forbidden! You do not have permission.", 403);
    }
    const jwt_payload = {
        id: user.id,
        username: user.username,
        email: user.email,
        platformRole: user.platformRole,
        isPremium: user.isPremium,
        package: user.package,
    };
    if (isAccessTokenExpired || !accessToken) {
        const newAccessToken = generateToken(credentials.jwt_access_token_secret, jwt_payload, credentials.jwt_access_token_expires);
        const newRefreshToken = generateToken(credentials.jwt_refresh_token_secret, jwt_payload, credentials.jwt_refresh_token_expires);
        sendCookie(res, "accessToken", newAccessToken);
        sendCookie(res, "refreshToken", newRefreshToken);
    }
    req.user = jwt_payload;
    next();
});
export default verifyUser;
