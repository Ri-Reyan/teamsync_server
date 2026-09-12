import jwt from "jsonwebtoken";
export const generateToken = (secret, payload, time) => {
    return jwt.sign(payload, secret, {
        expiresIn: time,
    });
};
export const verifyToken = (token, secret) => {
    return jwt.verify(token, secret);
};
export const sendCookie = (res, name, value) => {
    const isProduction = process.env.NODE_ENV === "production";
    res.cookie(name, value, {
        httpOnly: true,
        secure: isProduction,
        sameSite: isProduction ? "none" : "lax",
        path: "/",
        maxAge: name === "refreshToken" ? 1000 * 60 * 60 * 24 * 7 : 1000 * 60 * 60 * 24,
    });
};
