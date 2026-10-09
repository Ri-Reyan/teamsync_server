import { Resend } from "resend";
import AppError from "../global/AppError.js";

type SendEmailPayloadType = {
  to: string;
  subject: string;
  text?: string;
  html?: string;
};

export const sendEmail = async (payload: SendEmailPayloadType) => {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    throw new AppError("Email service is not configured", 500);
  }

  if (!payload.text && !payload.html) {
    throw new AppError("Email must include text or HTML content", 400);
  }

  const resend = new Resend(apiKey);

  const { data, error } = await resend.emails.send({
    from,
    to: payload.to,
    subject: payload.subject,
    text: payload.text ?? "",
    html: payload.html ?? "",
  });

  if (error) {
    throw new AppError(`Failed to send email: ${error.message}`, 502);
  }

  return data;
};
