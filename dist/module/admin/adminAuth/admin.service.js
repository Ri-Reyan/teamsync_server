import path from "path";
import ejs from "ejs";
import AppError from "../../../global/AppError.js";
import { prisma } from "../../../lib/prisma.js";
import redisClient from "../../../lib/redis.js";
import { convertToHash, verifyHash } from "../../../utils/argon.js";
import { genOtp } from "../../../utils/otp.js";
import { sendEmail } from "../../../utils/sendEmail.js";
const pendingAdminKey = (email) => `unverified_admin:${email}`;
const adminOtpKey = (email) => `verify_admin_otp:${email}`;
const loginAdmin = async (email, password) => {
    const admin = await prisma.user.findUnique({ where: { email } });
    if (!admin || admin.platformRole !== "ADMIN" || !admin.password) {
        throw new AppError("Invalid email or password", 401);
    }
    if (admin.status !== "ACTIVE") {
        throw new AppError("Admin account is suspended", 403);
    }
    if (!(await verifyHash(admin.password, password))) {
        throw new AppError("Invalid email or password", 401);
    }
    return admin;
};
const requestAdminCreation = async (payload) => {
    const existingUser = await prisma.user.findUnique({
        where: { email: payload.email },
    });
    if (existingUser) {
        throw new AppError("A user with this email already exists", 400);
    }
    await redisClient.del(pendingAdminKey(payload.email));
    await redisClient.del(adminOtpKey(payload.email));
    const otp = genOtp();
    const hashedPassword = await convertToHash(payload.password);
    const templatePath = path.join(process.cwd(), "src/views/verify-email.ejs");
    const html = await ejs.renderFile(templatePath, {
        username: payload.username,
        otpCode: otp,
        expiresIn: 15,
    });
    await redisClient.set(pendingAdminKey(payload.email), JSON.stringify({
        username: payload.username,
        email: payload.email,
        password: hashedPassword,
    }), { expiration: { type: "EX", value: 60 * 15 } });
    await redisClient.set(adminOtpKey(payload.email), JSON.stringify(otp), {
        expiration: { type: "EX", value: 60 * 15 },
    });
    await sendEmail({
        to: payload.email,
        subject: "Verify your Team Sync admin account",
        html,
    });
};
const verifyAdminCreation = async (email, otp) => {
    const pendingAdmin = await redisClient.get(pendingAdminKey(email));
    const storedOtp = await redisClient.get(adminOtpKey(email));
    if (!pendingAdmin || !storedOtp || JSON.parse(storedOtp) !== Number(otp)) {
        throw new AppError("Invalid or expired otp", 400);
    }
    const adminData = JSON.parse(pendingAdmin);
    const admin = await prisma.user.create({
        data: {
            ...adminData,
            platformRole: "ADMIN",
            signUpMethod: "CREDENTIALS",
        },
        omit: { password: true },
    });
    await redisClient.del(pendingAdminKey(email));
    await redisClient.del(adminOtpKey(email));
    return admin;
};
export const adminAuthService = {
    loginAdmin,
    requestAdminCreation,
    verifyAdminCreation,
};
