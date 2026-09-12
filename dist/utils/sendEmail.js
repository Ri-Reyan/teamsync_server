import nodemailer from "nodemailer";
import { credentials } from "../config/credentials.js";
import AppError from "../global/AppError.js";
const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: credentials.email_user,
        pass: credentials.email_pass,
    },
});
export const sendEmail = (payload) => transporter.sendMail({
    from: process.env.EMAIL_USER,
    to: payload.to,
    subject: payload.subject,
    text: payload.text,
    html: payload.html,
}, (error, info) => {
    if (error) {
        throw new AppError(error.message, 400);
    }
});
