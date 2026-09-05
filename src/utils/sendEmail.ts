import nodemailer from "nodemailer";
import { credentials } from "../config/credentials.js";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: credentials.email_user,
    pass: credentials.email_pass,
  },
});

type SendEmailPayloadType = {
  to: string;
  subject: string;
  text?: string;
  html?: any;
};

export const sendEmail = (payload: SendEmailPayloadType) =>
  transporter.sendMail(
    {
      from: process.env.EMAIL_USER,
      to: payload.to,
      subject: payload.subject,
      text: payload.text,
      html: payload.html,
    },
    (error, info) => {
      if (error) {
        console.log(error);
      } else {
        console.log("Email sent: " + info.response);
      }
    },
  );
